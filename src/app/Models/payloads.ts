import { ChatRoom } from "./chat-room";
import { Message } from "./message";
import { User, IUser } from "./user";

export interface LoginPayload {
  user: IUser;
  chatRooms: ChatRoom[];
}

export interface JoinPayload {
  user: IUser;
  chatRoomId: number;
}

export interface ChatRoomChangePayload {
  roomId: number;
  users: IUser[];
  messages: Message[];
}

export interface MessagePayload {
  user: IUser;
  message: Message;
  chatRoomId: number;
}
