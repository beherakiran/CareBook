import express from "express";
import { changePassword, login, register, updateProfile, viewProfile } from "../../controllers/website/user.controller.js";
import auth from "../../middleware/auth.middleware.js";
const route = express.Router();

export default (server)=> {
  route.post("/register", register);
  route.post("/login", login);
  route.get("/view-profile",auth ,viewProfile)
  route.put('/update-profile', auth, updateProfile)
   route.put('/change-password', auth, changePassword)


  server.use("/api/website/user", route);
  
};
  

