const path = require("path");
const fs = require("fs")
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
require("dotenv").config({
  path: path.resolve(__dirname, "./config.env"),
});
const express = require("express");
const multer = require("multer");
//const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Ensure the file extension is .jpg
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept image files only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});

const fsPromises = require("fs").promises;
const os = require("os");
const http = require("http");
const https = require("https");
const cors = require("cors");
const { GoogleAIFileManager, File } = require("@google/generative-ai/server");
const { generatePrompt } = require("./generatePrompt");
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const app = express();
//app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Simple API route

app.post("/getTextDetails", async (req, res) => {
  try {
    console.log(req.body)
    const {userData, userText} = req.body;

    const result = await generatePrompt(userData, null, userText);

    console.log(result);
    console.log("response 1");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getImageDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getImageDetails", upload.single("image"), async (req, res) => {
  try {
    const userData = JSON.parse(req.body.userData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(404).json({ error: "Image file is not found" });
    }

    console.log("Uploading file");
    const uploadResult = await fileManager.uploadFile(imageFile.path, {
      mimeType: "image/jpeg",
      displayName: imageFile.originalname,
    });
    console.log("Uploading done");

    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);

    const result = await generatePrompt(userData, file);

    // Delete the temporary file
    await fsPromises.unlink(imageFile.path);

    console.log(result);
    console.log("response 1");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getImageDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.use("*", (req, res) => {
  console.log(req,req.path)
  res.status(400).send({ error: "bad request - Unsupported API" });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send("Internal Error"); // Send a 500 status with a message
});

// Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err); 
  //process.exit(1);
});


const port = process.env.PORT || 8080;
const useHttps = process.env.USE_HTTPS;
console.log(useHttps);
if (useHttps === "true") {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };

  // HTTPS Server
  const httpsServer = https.createServer(httpsOptions, app);
  httpsServer.listen(port, process.env.HOST, () => {
    console.log(`HTTPS server running on port ${process.env.HOST} ${port}`);
  });
} else {
  // HTTP Server
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`HTTP server running on port ${process.env.HOST} ${port}`);
  });
}