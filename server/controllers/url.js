import { nanoid } from "nanoid";
import URL from "../models/url.js";
import dotenv from "dotenv";
dotenv.config();
const aliasRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const generateNewShortURL = async (req, res) => {
  const body = req.body;

  try {
    if (!body.url) {
      return res.status(400).json({ error: "URL is required." });
    }

    const existingUrl = await URL.findOne({ redirectURL: body.url });

    if (existingUrl) {
      if (!existingUrl.shortId) {
        existingUrl.shortId = nanoid(8);
        await existingUrl.save();
        return res.status(200).json({
          id: existingUrl.shortId,
          alias: existingUrl.alias || null,
          message: "Shortened URL generated successfully.",
        });
      }

      return res.status(200).json({
        id: existingUrl.shortId,
        alias: existingUrl.alias || null,
        message: "Shortened URL already exists.",
      });
    }

    const shortID = nanoid(8);
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      alias: null,
    });

    return res.status(201).json({
      id: shortID,
      message: "Shortened URL is generated successfully.",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const generateNewCustomURL = async (req, res) => {
  const body = req.body;

  try {
    if (!body.url) {
      return res.status(400).json({ error: "URL is required." });
    }

    if (!body.alias) {
      return res.status(400).json({ error: "Alias is required." });
    }

    if (!aliasRegex.test(body.alias)) {
      return res.status(400).json({
        error: "Invalid alias. ",
      });
    }

    const existingAlias = await URL.findOne({ alias: body.alias });
    if (existingAlias && existingAlias.redirectURL !== body.url) {
      return res
        .status(400)
        .json({ error: "Alias is already taken for a different URL." });
    }

    const existingUrl = await URL.findOne({ redirectURL: body.url });

    if (existingUrl) {
      if (existingUrl.alias && existingUrl.alias !== body.alias) {
        return res
          .status(400)
          .json({ error: "This URL already has a different alias." });
      }

      if (!existingUrl.alias) {
        existingUrl.alias = body.alias;
        await existingUrl.save();
        return res.status(200).json({
          id: existingUrl.alias,
          message: "Custom shortened URL is generated successfully.",
        });
      }

      if (existingUrl.alias === body.alias) {
        return res.status(200).json({
          id: existingUrl.alias,
          message: "Custom shortened URL is generated successfully.",
        });
      }
    }

    await URL.create({
      shortId: null,
      alias: body.alias,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.status(201).json({
      id: body.alias,
      message: "Custom shortened URL is generated successfully.",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const redirectToURL = async (req, res) => {
  let id = req.params.id;

  try {
    if (id.includes("+")) {
      id = id.replace(/\+/g, "");

      return res
        .status(200)
        .redirect(`${process.env.snap_url_VERCEL}preview/${id}`);
    }

    const entry = await URL.findOne({
      $or: [{ shortId: id }, { alias: id }],
    });

    if (!entry) {
      return res.status(404).json({ error: "URL not found." });
    }

    await URL.findOneAndUpdate(
      { _id: entry._id },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    res.status(200).redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

const getAnalytics = async (req, res) => {
  const id = req.params.id;

  try {
    const query = {
      $or: [{ shortId: id }, { alias: id }],
    };

    const result = await URL.findOne(query);

    if (!result) {
      return res.status(404).json({ error: "URL not found." });
    }

    return res.status(200).json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

const getPreview = async (req, res) => {
  const id = req.params.id;

  try {
    const query = {
      $or: [{ shortId: id }, { alias: id }],
    };

    const result = await URL.findOne(query);

    if (!result) {
      return res.status(404).json({ error: "URL not found." });
    }

    return res.status(200).json({
      redirectURL: result.redirectURL,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

export default {
  generateNewShortURL,
  redirectToURL,
  getAnalytics,
  generateNewCustomURL,
  getPreview,
};
