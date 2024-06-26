require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const fs = require("fs");
const ApiResponse = require("../models/apiResponse");
const checkToken = require("../middleware");
const multer = require("multer");
const { google } = require("googleapis");

const upload = multer({ dest: "uploads/" });

// Google Drive API setup
const auth = new google.auth.GoogleAuth({
  keyFile: "./cred.json",
  scopes: "https://www.googleapis.com/auth/drive",
});

const drive = google.drive({ version: "v3", auth });

router.post("/", upload.array("files", 12), async (req, res) => {
  try {
    const files = req.files;
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      const fileMetadata = {
        name: files[i].originalname,
        parents: [process.env.GOOGLE_FOLDER_ID], // Folder ID
      };

      const media = {
        mimeType: files[i].mimetype,
        body: fs.createReadStream(files[i].path),
      };

      const response = await drive.files.create({
        includePermissionsForView: "published",
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      console.log("File uploaded successfully. File ID:", response.data.id);

      const successResponse = ApiResponse.success({
        image_id: response.data.id,
      });
      res.json(successResponse);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorResponse = ApiResponse.error(500, "Error uploading file.");
    res.send(errorResponse);
  }
});

router.post("/delete_image/", checkToken, async (req, res) => {
  try {
    const image_id = req.body.image_id;
    console.log(req.body.image_id);

    const response = await drive.files.delete({
      fileId: image_id,
    });

    console.log("File deleted successfully.");
    const successResponse = ApiResponse.success(response);
    res.json(successResponse);
  } catch (error) {
    console.error("Error deleting file:", error);
    const errorResponse = ApiResponse.error(500, "Error deleting file.");
    res.send(errorResponse);
  }
});

module.exports = router;
