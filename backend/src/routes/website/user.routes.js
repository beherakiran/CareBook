import express from "express";
import { login, register } from "../../controllers/website/user.controller.js";
const route = express.Router();

export default (server)=> {
  route.post("/register", register);
  route.post("/login", login);
  server.use("/api/website/user", route);
};
