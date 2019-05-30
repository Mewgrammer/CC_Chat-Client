import {AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ChatRoom} from '../../Models/chat-room';
import {Subscription} from 'rxjs';
import {Message, MessageType, IMessage} from '../../Models/message';
import {User} from '../../Models/user';
import {MatList} from '@angular/material';
import {UploadedFile} from '../../Models/uploaded-file';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @ViewChild("chatMessagesContainer")
  public _chatMessagesContainer: ElementRef;

  @ViewChild("fileInput")
  public _fileInput: ElementRef;

  public files: File[] = [];

  @Input("chatRoom")
  public set ChatRoom(room: ChatRoom) {
    this._chatRoom = room;
  }
  public get MessageTypes() {
    return MessageType;
  }
  public get Messages() {
    return [...this._chatRoom.messages];
  }
  public get Users() {
    return this._chatRoom.users.filter( u => u.id != this.chatService.User.id);
  }

  private _chatRoom: ChatRoom;
  private _chatRoomSubscription: Subscription;
  receivers = [];
  isPrivateMessage = false;
  message = '';
  constructor(public chatService: ChatService) { }

  ngOnInit() {
    this._chatRoomSubscription = this.chatService.chatRoomChanged.subscribe((room) => {
      if(this._chatRoom != null && room.name == this._chatRoom.name) {
        this._chatRoom.messages = [...room.messages];
        this._chatRoom.users = [...room.users];
        this.files = [];
        console.log("ChatRoom Changed:", this._chatRoom);
      }
    });
  }

  ngAfterViewInit() {
    this.autoScrollMessages();
  }

  ngAfterViewChecked(): void {
    this.autoScrollMessages();
  }

  private autoScrollMessages() {
    this._chatMessagesContainer.nativeElement.scrollTop = this._chatMessagesContainer.nativeElement.scrollHeight;
  }

  async sendMessage(message: string) {
    console.log("Sending Message", message, this.files);
    if (message.length > 0 || this.files.length > 0) {
      let attachments: UploadedFile[] = [];
      if(this.files.length > 0) {
        attachments = await this.chatService.uploadFiles(this.files);
      }
      if(this.isPrivateMessage) {
        this.chatService.sendPrivateMessage(this._chatRoom, message, this.receivers, attachments);
      }
      else{
        this.chatService.sendMessage(this._chatRoom, message, attachments);
      }
    }
    this.files = [];
    this.message = '';
    this._fileInput.nativeElement.value = "";
  }

  onFileInput() {
    const files: { [key: string]: File } = this._fileInput.nativeElement.files;
    this.files = [];
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.push(files[key]);
      }
    }
    // this.sendFile(this.files);
  }

  public onMessageClick(message: IMessage) {
    const msg = this._chatRoom.messages.find(m => m.id == message.id);
    msg.showTranslated = !msg.showTranslated;
  }

  onRemoveAttachment(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }

  ngOnDestroy(): void {
  }
}
