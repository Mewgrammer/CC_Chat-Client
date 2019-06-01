import { LanguageChangePayload, ServerInfoPayload, TranslationPayload } from './../Models/payloads';
import {Injectable} from '@angular/core';
import {ChatRoom, IChatRoom} from '../Models/chat-room';
import {Subject} from 'rxjs';
import {IMessage, Message, MessageType} from '../Models/message';
import {LoginPayload, MessagePayload, JoinPayload, ChatRoomChangePayload, MoodPayload} from '../Models/payloads';
import * as io from 'socket.io-client';
import {User} from '../Models/user';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UploadedFile} from '../Models/uploaded-file';
import { IdentifiableLanguage } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService{
  private _currentChatRoom: ChatRoom;
  private _chatRooms: ChatRoom[] = [];
  private _user: User = null;
  private _loggedIn = false;
  private _connected = false;
  private _socket: SocketIOClient.Socket;
  private _connecting = false;
  private _serverUrl = "https://mew-server.eu-de.mybluemix.net";
  private _languages: IdentifiableLanguage[] = [
    {
      language: "de",
      name: "German"
    }
  ];
  private _targetLanguage: string = "de";
  private _userCredentials: {name: string, password: string};

  public FileSizeLimitBytes = 80000;
  public currentRoomChanged: Subject<ChatRoom>;
  public userNameChanged: Subject<string>;
  public chatRoomsChanged: Subject<ChatRoom[]>;
  public chatRoomChanged: Subject<ChatRoom>;
  public loginRefused: Subject<string>;
  public registrationFailed: Subject<string>;
  public languageChanged: Subject<IdentifiableLanguage>;
  public connectionEstablished: Subject<void>;
  public connectionLost: Subject<void>;

  public get ServerUrl() {
    return this._serverUrl;
  }
  public get Connected() {
    return this._connected;
  }
  public  get Connecting() {
    return this._connecting;
  }
  public get CurrentChatRoom() {
    return this._currentChatRoom == null ? null : {...this._currentChatRoom};
  }
  public get ChatRooms() {
    return [...this._chatRooms];
  }
  public get User() {
    return this._user;
  }
  public get Username() {
    if(this._user == null) return "";
    return this._user.name;
  }
  public get LoggedIn() {
    return this._loggedIn;
  }
  public get Language() {
    return this._targetLanguage;
  }
  public get Languages() {
    return this._languages;
  }

  constructor(private http: HttpClient) {
    this.currentRoomChanged = new Subject<ChatRoom>();
    this.userNameChanged = new Subject<string>();
    this.chatRoomChanged = new Subject<ChatRoom>();
    this.chatRoomsChanged = new Subject<ChatRoom[]>();
    this.loginRefused = new Subject<string>();
    this.registrationFailed = new Subject<string>();
    this.connectionLost = new Subject<void>();
    this.languageChanged = new Subject<IdentifiableLanguage>();
    this.connectionEstablished = new Subject<void>();
    const serverUrl = localStorage.getItem("server-url");
    if(serverUrl != null && serverUrl != "") {
      this._serverUrl = serverUrl;
    }
    this.connect(this._serverUrl);
  }

  public connect (serverUrl: string) {
    console.log("Connecting to ChatServer on ", serverUrl);
    this._serverUrl = serverUrl;
    if(this._socket != null) {
      this.disconnect();
    }
    localStorage.setItem("server-url", serverUrl);
    this._socket = io(this._serverUrl, {
      secure: true,
      transports: ['websocket'],
    });
    this._connected = this._socket.connected;
    this.initEventListeners();
  }

  disconnect() {
    console.log("Disconnecting from ChatServer on ", this._serverUrl);
    this._socket.disconnect();
    this._socket.close();
    this._socket = null;
    this._connecting = false;
    this._connected = false;
  }

  public isCurrentUser(user: User) {
    return user != null && this.User != null && user.id == this.User.id && user.name == this.Username
  }

  public changeLanguage(language: string) {
    this._targetLanguage = language;
    this.languageChanged.next(this.Languages.find(l => l.language == language));
    if(!this.User) return;
    const payload: LanguageChangePayload = {
      userId: this.User.id,
      language: language
    };
    this._socket.emit("change-language", payload);
  }

  public async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    console.log("Uploading files", files);
    const url = this._serverUrl + "/upload";
    let uploadedFiles: UploadedFile[] = [];
    for(let file of files) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      const result = await this.http.post(url, formData).toPromise() as string;
      console.log("Upload Result", result);
      const uls = JSON.parse(result) as UploadedFile[];
      uls.forEach( f => uploadedFiles.push(f));
    }
    return uploadedFiles;
  }

  public async downloadUploadedFile(file: UploadedFile): Promise<Blob> {
    console.log("Download", file);
    const url = this._serverUrl + "/download";
    return await this.http.post(url, JSON.stringify(file), {
      headers: { 'Content-Type': 'application/json' },
      responseType: "blob"
    }).toPromise();
  }

  private initEventListeners(): void {
    this._socket.io.on("connect_error", (err) => {
      console.warn("Socket connection failed", err);
      this.connectionLost.next();
      this.tryRestoreConnection();
    });
    this._socket.io.on("reconnect_error", (err) => {
      console.warn("Socket reconnection failed", err);
      this.connectionLost.next();
      this.tryRestoreConnection();
    });
    this._socket.io.on("reconnect", () => {
      console.log("Socket reconnection successful");
      this._connected = true;
      this.connectionEstablished.next();
    });
    this._socket.io.on("connect", () => {
      console.log("Socket connection established");
      this._connected = true;
      this.connectionEstablished.next();
    });
    this._socket.on("disconnect", (x) => {
      console.log("Socket Disconnected", x);
      this.tryRestoreConnection();
    });
    this._socket.on("server-info", async (payload: ServerInfoPayload) => {
      this._connected = true;
      this._languages = payload.supportedLanguages;
      if(this._userCredentials != null) {
        await this.login(this._userCredentials.name, this._userCredentials.password);
      }
      const targetLang = payload.supportedLanguages.find(l => l.language == (this.LoggedIn ? this.User.language : "de"));
      this._targetLanguage = targetLang.language;
      this.languageChanged.next(targetLang);
      console.log("Received Server-Info", payload);
    });
    this._socket.on("join", (chatRoom: ChatRoom) => {
      this._currentChatRoom = chatRoom;
      this._currentChatRoom.messages.forEach(msg => msg.read = true);
      this._currentChatRoom.messages.forEach(msg => msg.showTranslated = true);
      this.currentRoomChanged.next(chatRoom);
    });
    this._socket.on("moodChanged", (payload: MoodPayload) => {
      console.log("Mood Changed", payload.newMood);
      if(payload.userId == this.User.id) {
        this._user.mood = payload.newMood;
      }
      const user = this._currentChatRoom.users.find(u => u.id === payload.userId);
      if(user) {
        user.mood = payload.newMood;
        this.currentRoomChanged.next(this.CurrentChatRoom);
      }
      console.log(this.CurrentChatRoom.users);
    });
    this._socket.on("chatroom-changed", (payload: ChatRoomChangePayload) => {
      console.log("ChatRoom changed!", payload);
      if(this._currentChatRoom.id !== payload.roomId) return;
      if(payload.users != null && payload.users.length > 0) {
        this._currentChatRoom.users = [...payload.users];
        this._currentChatRoom.users.forEach(u => {
          if(u.profilePictureLink.length == 0) {
            u.profilePictureLink = "/images/profile-picture-" + u.id + ".jpg";
          }
        })
      }
      payload.messages.forEach(msg => {
        this._currentChatRoom.messages.push({...msg, showTranslated: true});
      });
      this.currentRoomChanged.next({...this._currentChatRoom});
      // this.translateMessagesOfChatRoom(payload.messages, this._currentChatRoom);
    });
    this._socket.on("message-translated", (payload: TranslationPayload) => {
      const message = this._currentChatRoom.messages.find(m => m.id == payload.messageId);
      if(message != null) {
        // message.content = payload.translatedContent;
        message.showTranslated = true;
        message.translatedContent = payload.translatedContent;
        console.log("Message translated", message);
      }
      else {
        console.warn("Translated Message not found in CurrentChatRoom", this.CurrentChatRoom.messages);
      }
    });
    this._socket.on("handshake", (payload: any) => {
      console.log("Socket IO Server handshake complete", payload);
      if(this._chatRooms.length > 0) {
        if(this._currentChatRoom != null) {
          this.changeChatRoom(this._currentChatRoom);
        }
        else {
          this.changeChatRoom(this._chatRooms[0]);
        }
      }
      else {
        console.warn("No ChatRooms ! - cannot join any");
      }
    });
    console.log("Event-Listeners registered");
  }

  private configureSocketIOConnection() {
    this._socket.emit("configure", this._user.id);
  }

  private tryRestoreConnection() {
    if(this._socket != null) {
      this._socket.disconnect();
      this._socket.close();
    }
    this._socket = io(this._serverUrl, {
      secure: true,
      transports: ['websocket'],
    });
    this._connected = this._socket.connected;
    this.initEventListeners();
  }

  public async autoLogin() {
    console.log("Auto-Login");
    const url = this._serverUrl + "/login";
    try {
      const payload = (await this.http.post(url, JSON.stringify({}), {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }).toPromise()) as LoginPayload;
      console.log("Logged-In", payload);
      this._user = payload.user;
      this.configureSocketIOConnection();
      this._loggedIn = true;
      if(payload.user.language) {
        this._targetLanguage = payload.user.language;
        this.languageChanged.next(this.Languages.find(l => l.language == this._targetLanguage));
      }
      this._chatRooms = [...payload.chatRooms];
      this.onChatRoomsUpdated([...this._chatRooms]);
    }
    catch (e) {
      console.warn("Auto-Login Failed :", e);
    }
  }

  public async logout() {
    console.log("Logout");
    const url = this._serverUrl + "/logout";
    try {
      this._socket.emit("leave", {
        user: this._user,
        chatRoomId: this._currentChatRoom.id
      });
      await this.http.post(url, JSON.stringify({}), {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }).toPromise();
      this._loggedIn = false;
    }
    catch (e) {
      console.warn("Logout Failed :", e);
      this._loggedIn = false;
    }
  }

  public async login(username: string, password: string) {
    const body = {
      name: username,
      password: password,
    };
    this._userCredentials = {...body};
    console.log("Login", body);
    const url = this._serverUrl + "/login";
    try {
      const payload = (await this.http.post(url, JSON.stringify(body), {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }).toPromise()) as LoginPayload;
      console.log("Logged-In", payload);
      if(payload.user.name === username) {
        this._user = payload.user;
        this.configureSocketIOConnection();
        this._loggedIn = true;
        if(payload.user.language) {
          this._targetLanguage = payload.user.language;
          this.languageChanged.next(this.Languages.find(l => l.language == this._targetLanguage));
        }
        this._chatRooms = [...payload.chatRooms];
        this.onChatRoomsUpdated([...this._chatRooms]);
      }
      else {
        console.error("Username mismatch !", this.User, payload);
      }
    }
    catch (e) {
      console.warn("Login Failed :", e);
      const err = e as HttpErrorResponse;
      this.loginRefused.next(err.error.result);
    }
  }

  public async register(username: string, password: string, profileImage: File) {
    const body = {
      name: username,
      password: password,
    };
    console.log("register", body);
    const url = this._serverUrl + "/register";
    try {
      const formData: FormData = new FormData();
      if(profileImage)
        formData.append('file', profileImage, profileImage.name);
      formData.append('user', JSON.stringify(body));
      const user = await this.http.post(url, formData, {
        withCredentials: true,
      }).toPromise();
      console.log("Register Result", user);
      console.log("Registered", user);
      await this.login(username, password);
    }
    catch (e) {
      const err = e as HttpErrorResponse;
      console.warn("Register Failed :", e);
      this.registrationFailed.next("Registration failed - " + err.error);
    }
  }

  public sendMessage(room: ChatRoom, message: string, attachments: UploadedFile[] = []) {
    const payload: MessagePayload = {
      user: this._user,
      chatRoomId: room.id,
      message: new Message(this._user, message, MessageType.broadcast, [], [...attachments])
    };
    console.log("Sending Message:", payload.message);
    this._socket.emit("message", {...payload});
  }

  public sendPrivateMessage(room: ChatRoom, message: string, recipients: User[], attachments: UploadedFile[] = []) {
    const payload: MessagePayload = {
      user: {...this._user},
      chatRoomId: room.id,
      message: new Message({...this._user}, message, MessageType.private, [...recipients], [...attachments])
    };
    console.log("Sending Private Message:", payload.message);
    this._socket.emit("message", {...payload});
  }

  public changeChatRoom(room: ChatRoom) {
    // if(this._currentChatRoom != null && this._currentChatRoom.name === room.name) return;
    console.log("Joining ChatRoom", room);
    this._socket.emit("join", {
      user: this._user,
      chatRoomId: room.id
    });
  }

  private onChatRoomsUpdated(rooms: ChatRoom[]) {
      this._chatRooms = rooms;
      this.chatRoomsChanged.next(rooms);
  }

}
