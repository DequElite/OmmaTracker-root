import express, { Express } from "express";
import InitRoutes from "./routes/router";
import ReturnEndPoints from "../../../shared/Utils/endPointsList";
import ConfigDB from "../../../shared/DataBase/db.config";
import colorize from "../../../shared/Utils/colorConsole";
import dotenv from "dotenv";

export const app: Express = express();

ConfigDB();
InitRoutes(app);

dotenv.config();
const PORT = process.env.PORT || 5005;

app.listen(PORT, ()=>{
    console.log(colorize(`Register service was started on port ${PORT}`, 'green', 'black', 'bold'));
    setTimeout(() => {
        ReturnEndPoints(app);
    }, 2000);
})
