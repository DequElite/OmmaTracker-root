import express, { Express } from "express";
import InitRoutes from "./routes/router";
import ReturnEndPoints from "../../../shared/Utils/endPointsList";
import ConfigDB from "../../../shared/DataBase/db.config";
import colorize from "../../../shared/Utils/colorConsole";
import dotenv from "dotenv";
import io from "socket.io-client";

export const app: Express = express();

ConfigDB();
InitRoutes(app);

dotenv.config();
const PORT = process.env.PORT || 5004;

const socket = io("http://localhost:5006", { path:'/omma/socket.io' });

app.listen(PORT, ()=>{
    console.log(colorize(`Notification service was started on port ${PORT}`, 'green', 'black', 'bold'));
    setTimeout(() => {
        ReturnEndPoints(app);
    }, 2000);
})
app.set("io", socket); 