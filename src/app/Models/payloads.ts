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

export interface LanguageChangePayload {
  userId: string,
  language: string;
}

export interface TranslationPayload {
  messageId: number,
  translatedContent: string;
}

export interface ChatRoomChangePayload {
  roomId: number;
  users: IUser[];
  messages: Message[];
}

export interface MoodPayload {
  userId: string;
  newMood: EMood;
}

export interface MessagePayload {
  user: IUser;
  message: Message;
  chatRoomId: number;
}
