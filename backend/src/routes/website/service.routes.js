import express from "express";

import { details, view } from "../../controllers/website/service.controller.js";
import auth from "../../middleware/auth.middleware.js";

const route = express.Router();

export default (server) => {
  route.post("/view", auth, view);
  route.post("/details/:id",auth,details)

  server.use("/api/website/user/service", route);
};
