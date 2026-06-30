import { Router } from "express";
import { config } from "../config.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    server: config.serverName,
    version: config.serverVersion,
    time: new Date().toISOString(),
  });
});

export default router;
