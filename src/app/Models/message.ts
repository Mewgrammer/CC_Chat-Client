import { UploadedFile } from './uploaded-file';
import { User, IUser } from './user';

export enum MessageType {
  broadcast = 0,
  private = 1,
  server = 2,
}

export interface IMessage {
  id: number;
  sender: IUser;
  content: string;
  translatedContent?: string;
  showTranslated: boolean;
  type: MessageType;
  recipients: IUser[];
  attachments: UploadedFile[];
}

export class Message implements IMessage {
  public timeStamp: Date;
  public id: number = 0;
  public read = false;
  public translatedContent?: string;
  public showTranslated: boolean = true;
  constructor(public sender: IUser,
              public content: string,
              public type: MessageType = MessageType.broadcast,
              public recipients: IUser[] = [],
              public attachments: UploadedFile[] = [])
  {
    this.timeStamp = new Date();
  }
}
