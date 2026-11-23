import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ;

app.get("/",(req,res)=>{
    res.send("Welcome to CareBook")
})

app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`);
})