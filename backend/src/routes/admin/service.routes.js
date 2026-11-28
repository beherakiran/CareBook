import express from "express";
import { changeStatus, create, deleteService, details, update, view } from "../../controllers/admin/service.controller.js";
import adminAuth from "../../middleware/adminAuth.js"
import auth from "../../middleware/auth.middleware.js"
const route = express.Router();

export default (server) => {
  route.post("/create",auth ,adminAuth , create);
  route.post("/view",auth,adminAuth,view)
  route.post("/details/:id",auth,adminAuth,details)
  route.put("/update/:id",auth,adminAuth,update)
  route.delete("/delete/:id",auth,adminAuth,deleteService)
  route.put("/changestatus/:id",auth,adminAuth,changeStatus)

  server.use("/api/admin-panel/service", route);
};
