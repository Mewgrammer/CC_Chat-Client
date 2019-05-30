import * as http from "http";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";

const secure = require('express-force-https');
const hsts = require('hsts');
const helmet = require('helmet');

export class ChatServer {
  private _defaultPort = 80;
  private _app: express.Application;
  private _server: http.Server;
  private _port: string | number;

  private _corsOptions = {
    origin: (origin, callback) => {
        callback(null, false);
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
    this._app.use(helmet());
    this._app.use(hsts({
      maxAge: 15552000  // 180 days in seconds
    }))
    this._app.use(express.static(__dirname));
    this._app.get("/*", (req, res) => {
      res.sendFile(__dirname);
    });
    this._server = http.createServer(this._app);
  }

  public run() {
    this._server.listen(this._port, () => {
      console.log("Server listening on port %s, serving from %s", this._port, __dirname);
    });
  }

  public getApp(): express.Application {
    return this._app;
  }
}

let server = new ChatServer();
server.run();
let app = server.getApp();
export { app };
