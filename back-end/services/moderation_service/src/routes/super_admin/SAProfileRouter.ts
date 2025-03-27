import {Router} from "express";
import { authenticateSAToken } from "../../../../../shared/Middlewares/authenticateToken";
import { pool } from "../../../../../shared/DataBase/db.config";
import jwt from "jsonwebtoken";

const SAProfileRouter = Router();

SAProfileRouter.get('/profile', authenticateSAToken, (req,res)=>{
    const sa = (req as any).user;
    console.log(sa)
    res.json({message: 'access granted', sa:sa, isAdmin: (req as any).isAdmin});
});

export default SAProfileRouter;
