import express from "express";
import bodyParser from "body-parser";
import cors from "cors"

import dotenv from "dotenv";
dotenv.config();

const server = express();
const PORT = process.env.PORT ;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(bodyParser.json());
server.use(cors());

import connectDb from "./src/config/db.js";

import userRoutes from "./src/routes/website/user.routes.js";
import adminRoutes from "./src/routes/admin/admin.routes.js"
import adminServiceRoutes from "./src/routes/admin/service.routes.js"

await connectDb();

server.get("/",(req,res)=>{
    res.send("Welcome to CareBook")
})

//admin
adminRoutes(server)
adminServiceRoutes(server)

//website
userRoutes(server)

server.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
})


