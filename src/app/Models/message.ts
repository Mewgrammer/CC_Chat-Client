import { UploadedFile } from './uploaded-file';
import { User, IUser } from './user';

export enum MessageType {
  broadcast = 0,
  private = 1,
  server = 2,
}

export interface IMessage {
  sender: IUser;
  content: string;
  type: MessageType;
  recipients: IUser[];
  attachments: UploadedFile[];
}

export class Message implements IMessage {
  public timeStamp: Date;
  public read = false;
  constructor(public sender: User, public content: string, public type: MessageType = MessageType.broadcast, public recipients: User[] = [], public attachments: UploadedFile[] = []) {
    this.timeStamp = new Date();
  }
}
