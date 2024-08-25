import express from "express";
import urlController from "../controllers/url.js";

const router = express.Router();

const {
  generateNewShortURL,
  redirectToURL,
  getAnalytics,
  generateNewCustomURL,
} = urlController;

router.post("/", generateNewShortURL);
router.post("/custom", generateNewCustomURL);
router.get("/:id", redirectToURL);
router.get("/analytics/:id", getAnalytics);
export default router;
