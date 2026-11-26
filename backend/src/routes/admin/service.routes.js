import express from "express";
import { create } from "../../controllers/admin/service.controller.js";
import adminAuth from "../../middleware/adminAuth.js"
import auth from "../../middleware/auth.middleware.js"
const route = express.Router();

export default (server) => {
  route.post("/create",auth ,adminAuth , create);

  server.use("/api/admin-panel/service", route);
};
