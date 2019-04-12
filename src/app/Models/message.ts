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
  mood?: string;
  recipients: IUser[];
  attachments: UploadedFile[];
}

export class Message implements IMessage {
  public timeStamp: Date;
  public read = false;
  constructor(public sender: IUser,
              public content: string,
              public type: MessageType = MessageType.broadcast,
              public recipients: IUser[] = [],
              public attachments: UploadedFile[] = [],
              public mood?: string)
  {
    this.timeStamp = new Date();
  }
}
