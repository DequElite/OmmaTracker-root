import express, { Express } from "express";
import cookieParser from "cookie-parser";
import colorize from "../../../../shared/Utils/colorConsole";
import dotenv from "dotenv";
import cors from "cors";
import SignUpRouter from "./SignUp/SignUpRouter";
import SignInRouter from "./SignIn/SignInRouter";
import GoogleAuth from "./Google/GoogleAuth";
import SendKeyRouter from "./ForgotPassword/SendKeyRouter";
import ResetPasswordRouter from "./ForgotPassword/ResetPassword";

const API_DIR = "/api";

dotenv.config();

export default function InitRoutes(app:Express): void {
    app.use(express.json());
    app.use(cookieParser());

    app.use(cors({
        origin: process.env.APP_MODE === "DEV" ? process.env.FORNT_END_URI_DEV : process.env.FORNT_END_URI_PROD,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'admin-authorization'], 
        credentials: true, 
    }));

    app.get('/api/check-is-server-avaible', (req,res)=>{
        console.log(colorize("Sevrver is avaible", 'magenta', 'blue', 'bold'))
        res.status(200).json({ message: "Server is available" });
    });
    app.use(API_DIR, SignUpRouter);
    app.use(API_DIR, SignInRouter);
    app.use(API_DIR, GoogleAuth);
    app.use(API_DIR + '/forgot-password', SendKeyRouter);
    app.use(API_DIR, ResetPasswordRouter);
}


