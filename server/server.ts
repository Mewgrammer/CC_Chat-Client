import * as http from "http";
import * as https from "https";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as cors from "cors";
import * as secure from 'express-enforces-ssl';

export class HostingServer {
  private _defaultPort = 443;
  private _app: express.Application;
  private _server: https.Server;
  private _port: string | number;

  private _corsOptions = {
    origin: function(origin, callback){
      return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    this._port = process.env.PORT || this._defaultPort;
    this._app = express();
    this._app.use(cors(this._corsOptions));
    this._app.use(secure);
    this._app.use(express.static(path.join(__dirname, "assets")));
    const privateKey = fs.readFileSync(path.join(__dirname, "ssl", "privatekey.pem").toString());
    const certificate = fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem").toString());
    const secureOptions = {
      key: privateKey,
      cert: certificate,
      requestCert: false,
      rejectUnauthorized: false,
    };
    this._server = https.createServer(secureOptions, this._app);
    this.initializeApi();
  }

  private initializeApi() {
    this._server.listen(this._port, () => {
      console.log("server started on port %s", this._port);
    });
    this._app.get('/*', (req, res) => {
      console.log("Serving indexHtml", path.join(__dirname,'index.html'));
      res.sendFile(path.join(__dirname,'index.html'))
    });
  }

  public getApp(): express.Application {
    return this._app;
  }
}

let app = new HostingServer().getApp();
export { app };
