import { Router } from "express";
import { pool } from "../../../../../shared/DataBase/db.config";
import bcrypt from "bcrypt"

const ResetPasswordRouter = Router();

const SALT_ROUNDS = 10;

ResetPasswordRouter.post('/reset-password', async (req, res)=>{
    const {resetToken, newUserPassword} = req.body;
    console.log(req.body)

    try{
        const resultUserAdditional = await pool.query(`
            SELECT * FROM UsersAdditional
            WHERE resetToken = $1
        `, [resetToken]);

        if(resultUserAdditional.rowCount === 0) {
            throw new Error("TOKEN_NOT_FOUND")
        }

        if (new Date() > new Date(resultUserAdditional.rows[0].resetTokenExpireAt)) {
            throw new Error("TOKEN_EXPIRED");
        }        

        await pool.query(`
            UPDATE UsersAdditional 
            SET resetToken = $1, resetTokenExpireAt = $2
            WHERE user_id = $3
        `, [null, null, resultUserAdditional.rows[0].user_id]);

        const HashedPassword = await bcrypt.hash(newUserPassword, SALT_ROUNDS);

        await pool.query(`
            UPDATE Users 
            SET password = $1
            WHERE id = $2
        `, [HashedPassword, resultUserAdditional.rows[0].user_id]);

        res.status(200).json({
            message: "Password reseted successfully",
        });
    } catch (error) {
        res.status(500).json({message:"error at reset-password"});
        console.error("Error at send-code", error);
    }
})

export default ResetPasswordRouter;