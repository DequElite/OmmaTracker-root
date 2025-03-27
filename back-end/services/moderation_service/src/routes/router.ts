import express, { Express } from "express";
import cookieParser from "cookie-parser";
import colorize from "../../../../shared/Utils/colorConsole";
import dotenv from "dotenv";
import cors from "cors";
import SAProfileRouter from "./super_admin/SAProfileRouter";
import SignSARouter from "./super_admin/SignSA";
import NotificationsSARouter from "./notifications/NotificationsSARouter";
import UsersRouter from "./users/UsersRouter";

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
    app.use(API_DIR + "/super_admin", SAProfileRouter );
    app.use(API_DIR + "/super_admin", SignSARouter );
    app.use(API_DIR, NotificationsSARouter);
    app.use(API_DIR, UsersRouter);
}


