import {Component, Input, OnInit} from '@angular/core';
import {Message, MessageType} from '../../../Models/message';
import {ChatService} from '../../../services/chat.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input("message")
  set Message(msg: Message) {
    this.message = msg;
  }

  public get MessageTypes() {
    return MessageType;
  }

  public message: Message;
  constructor(protected chatService: ChatService) { }

  ngOnInit() {
  }

}
