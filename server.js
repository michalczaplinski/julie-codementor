// Load dependencies
const aws = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
var cors = require("cors");

var app = express();

app.use(cors());

// Use our env vars for setting credentials.
// Remove lines 11-14 if using ~/.aws/credentials file on a local server.
aws.config.update({
  secretAccessKey: "",
  accessKeyId: ""
});

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

// Change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eqofileserver",
    acl: "public-read",
    key: function(request, file, cb) {
      console.log(file);
      cb(null, file.originalname + "_" + new Date().toString());
    }
  })
}).array("file", 1);

// Views in public directory
app.use(express.static("public"));

// Main, error and success views
app.get("/", function(request, response) {
  response.send({ msg: "hello" });
});

app.get("/success", function(request, response) {
  response.send({ msg: "succes" });
});

app.get("/error", function(request, response) {
  response.send({ msg: "error" });
});

app.post("/upload", function(request, response, next) {
  upload(request, response, function(error) {
    if (error) {
      console.log(error);
      return response.redirect("/error");
    }

    console.log(request.files[0].location);

    console.log("File uploaded successfully.");

    response.redirect("/success");
  });
});

app.listen(3001, function() {
  console.log("Server listening on port 3001.");
});
