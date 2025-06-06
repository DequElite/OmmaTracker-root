import { Router } from "express";
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import jwt from "jsonwebtoken";
import { pool } from "../../../../../shared/DataBase/db.config";
import crypto from "crypto"

const GoogleAuth = Router();

require("dotenv").config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

const APP_MODE = process.env.APP_MODE || "DEV"; 
const CALLBACK_URL = APP_MODE === "PROD" 
    ? process.env.CALLBACK_URL_PROD 
    : process.env.CALLBACK_URL_DEV;

const CLIENT_URL = APP_MODE === "PROD" 
    ? process.env.CLIENT_URL_PROD 
    : process.env.CLIENT_URL_DEV;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID || "",
            clientSecret: GOOGLE_CLIENT_SECRET || "",
            callbackURL: CALLBACK_URL,
            passReqToCallback: true
        },
        async (_req, accessToken, refreshToken, profile, done) => {
            const email = profile.emails ? profile.emails[0].value : "";
            const username = profile.username || profile.displayName || email.split('@')[0];

            console.log("APP_MODE:", APP_MODE);
            console.log("CALLBACK_URL:", CALLBACK_URL);
            console.log("CLIENT_URL:", CLIENT_URL);


            try{
                let user = await pool.query(`
                    SELECT * FROM Users 
                    WHERE email = $1
                `, [email]);

                if(user.rows.length === 0){
                    const newUserPassword = crypto.randomBytes(16).toString("hex");

                    const newUser = await pool.query(`
                        INSERT INTO Users (username, password, email) 
                        VALUES ($1, $2, $3)
                        RETURNING id, username, email
                    `, [username, newUserPassword, email]);

                    user = newUser;
                }

                const accessToken = jwt.sign(
                    {id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email},
                    JWT_SECRET_KEY || "",
                    { expiresIn: "1h" }
                )

                const refreshToken = jwt.sign(
                    {id: user.rows[0].id},
                    JWT_SECRET_KEY || "",
                    { expiresIn: "30d" }
                )

                const existingAdditional = await pool.query(`
                    SELECT * FROM UsersAdditional 
                    WHERE user_id = $1
                `, [user.rows[0].id]);

                if (existingAdditional.rows.length > 0) {
                    await pool.query(`
                        UPDATE UsersAdditional 
                        SET refreshToken = $1
                        WHERE user_id = $2
                    `, [refreshToken, user.rows[0].id]);
                } else {
                    await pool.query(`
                        INSERT INTO UsersAdditional (user_id, refreshToken)
                        VALUES ($1, $2)
                    `, [user.rows[0].id, refreshToken]);
                }

                return done(null, {accessToken, refreshToken});
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

GoogleAuth.get(
    '/google', 
    passport.authenticate("google", {scope:["email", "profile"]})
)

GoogleAuth.get(
    '/google/callback',
    passport.authenticate("google", {session:false}),
    (req,res)=>{
        if (!req.user) {
            res.status(401).json({ error: "Authorization failed" });
            return
        }

        const { refreshToken, accessToken } = req.user as any;
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: process.env.APP_MODE === "DEV" ? "strict" : "none",
        });

        res.redirect(`${CLIENT_URL}/home?accessToken=${accessToken}`);
    }
)

export default GoogleAuth;