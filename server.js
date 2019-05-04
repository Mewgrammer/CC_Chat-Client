
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const secure = require('express-force-https');
const hsts = require('hsts');
const helmet = require('helmet');
const fs = require("fs");
const cors = require("cors");


const app = express();
const port = process.env.PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;
const corsOptions = {
  origin: (origin, callback) => {
      callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};
const privateKey = fs.readFileSync(path.join(__dirname, "ssl", "privatekey.pem").toString());
const certificate = fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem").toString());
const secureOptions = {
  key: privateKey,
  cert: certificate,
  requestCert: false,
  rejectUnauthorized: false,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "dist")));
app.use(helmet());
app.use(secure);
app.use(hsts({
  maxAge: 15552000  // 180 days in seconds
}));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname));
});

const server = http.createServer(app);
server.listen(port, () => console.log("HTTP-Server listening on Port %s", port));

const secureServer = https.createServer(secureOptions, app);
secureServer.listen(httpsPort, () => {
  console.log("HTTPS-Server listening on Port %s", httpsPort)
});
