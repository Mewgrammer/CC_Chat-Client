import { ChatRoom } from "./chat-room";
import { Message } from "./message";
import {User, IUser, EMood} from './user';
import { IdentifiableLanguage } from '../resources/interfaces';


export interface LoginPayload {
  user: IUser;
  chatRooms: ChatRoom[];
}

export interface JoinPayload {
  user: IUser;
  chatRoomId: number;
}

export interface ServerInfoPayload {
  supportedLanguages: IdentifiableLanguage[];
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

export interface MoodPayload {
  userId: number;
  newMood: EMood;
}

export interface LanguageChangePayload {
  userId: number,
  language: string;
}

export interface TranslationPayload {
  messageId: number,
  translatedContent: string;
}

export interface FilePayload {
  message: Message;
  chatRoom: ChatRoom;
}

export interface RegisterPayload {
  success: boolean;
}
