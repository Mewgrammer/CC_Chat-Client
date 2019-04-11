import {Injectable} from '@angular/core';
import {ChatRoom} from '../Models/chat-room';
import {Subject} from 'rxjs';
import {Message, MessageType} from '../Models/message';
import {LoginPayload, MessagePayload, JoinPayload, ChatRoomChangePayload} from '../Models/payloads';
import * as io from 'socket.io-client';
import {User} from '../Models/user';
import {HttpClient} from '@angular/common/http';
import {UploadedFile} from '../Models/uploaded-file';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  private _currentChatRoom: ChatRoom;
  private _chatRooms: ChatRoom[] = [];
  private _user: User = null;
  private _loggedIn = false;
  private _socket: SocketIOClient.Socket;
  private _serverUrl = "http://localhost:8080";

  public currentRoomChanged: Subject<ChatRoom>;
  public userNameChanged: Subject<string>;
  public chatRoomsChanged: Subject<ChatRoom[]>;
  public chatRoomChanged: Subject<ChatRoom>;
  public loginRefused: Subject<string>;

  public connectionEstablished: Subject<void>;
  public connectionLost: Subject<void>;

  public get ServerUrl() {
    return this._serverUrl;
  }
  public get Connected() {
    return this._socket != null && this._socket.connected;
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
    return this.Connected && this._user != null && this.Username.length > 0 && this._loggedIn;
  }

  constructor(private http: HttpClient) {
    this.currentRoomChanged = new Subject<ChatRoom>();
    this.userNameChanged = new Subject<string>();
    this.chatRoomChanged = new Subject<ChatRoom>();
    this.chatRoomsChanged = new Subject<ChatRoom[]>();
    this.loginRefused = new Subject<string>();
    this.connectionLost = new Subject<void>();
    this.connectionEstablished = new Subject<void>();
    // this.connect(this._serverUrl);
  }

  public connect (serverUrl: string) {
    console.log("Connecting to ChatServer on ", serverUrl);
    this._serverUrl = serverUrl;
    this._socket = io(this._serverUrl);
    this.initEventListeners();
  }

  public isCurrentUser(user: User) {
    return user != null && this.User != null && user.id == this.User.id && user.name == this.Username
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
      this._loggedIn = false;
      this.connectionLost.next();
    });
    this._socket.io.on("reconnect_error", (err) => {
      console.warn("Socket reconnection failed", err);
      this._loggedIn = false;
      this.connectionLost.next();
    });
    this._socket.io.on("reconnect", () => {
      console.log("Socket reconnection successful");
      this.connectionEstablished.next();
    });
    this._socket.io.on("connect", () => {
      console.log("Socket connection established");
      this.connectionEstablished.next();
    });
    this._socket.on("disconnect", (x) => {
      console.log("Socket Disconnected", x);
      this._socket = io("http://localhost:8080");
    });
    this._socket.on("username-taken", (username: string) => {
      console.log("Username taken:", username);
      this._loggedIn = false;
      this.loginRefused.next("Username '"+ username +"' is already taken");
    });
    this._socket.on("join", (chatRoom: ChatRoom) => {
      this._currentChatRoom = chatRoom;
      this._currentChatRoom.messages.forEach(msg => msg.read = true);
      this.currentRoomChanged.next(chatRoom);
    });
    this._socket.on("chatroom-changed", (payload: ChatRoomChangePayload) => {
      console.log("ChatRoom changed!", payload);
      if(this._currentChatRoom.id !== payload.roomId) return;
      if(payload.users != null && payload.users.length > 0) {
        this._currentChatRoom.users = [...payload.users];
      }
      payload.messages.forEach(msg => {
        this._currentChatRoom.messages.push(msg);
      });
      this.currentRoomChanged.next({...this._currentChatRoom});
    });
    this._socket.on("logged-in", (payload: LoginPayload) => {
      console.log("Logged In !", payload);
      this._loggedIn = true;
      this._user = payload.user;
      this._chatRooms = [...payload.chatRooms];
      this.onChatRoomsUpdated([...this._chatRooms]);
      if(this._chatRooms.length > 0) {
        this.changeChatRoom(this._chatRooms[0]);
      }
    });
    console.log("Event-Listeners registered");
  }

  public login(username: string) {
    this._socket.emit("login", username);
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
    if(this._currentChatRoom != null && this._currentChatRoom.name === room.name) return;
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
