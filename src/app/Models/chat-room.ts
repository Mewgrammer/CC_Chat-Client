import { Message, IMessage } from './message';
import { User, IUser } from './user';

export interface IChatRoom {
  id: number;
  name: string;
  users: IUser[];
  messages: IMessage[];
}

export class ChatRoom {
  public id = 0;

  constructor(public name: string, public users: User[] = [], public messages: Message[] = []) {
  }
}
