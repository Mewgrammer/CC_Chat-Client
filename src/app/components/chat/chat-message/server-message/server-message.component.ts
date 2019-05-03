import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../../Models/message';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-server-message',
  templateUrl: './server-message.component.html',
  styleUrls: ['./server-message.component.scss']
})
export class ServerMessageComponent implements OnInit {

  @Input("message")
  set Message(msg: Message) {
    this.message = msg;
  }
  public message: Message;

  constructor(public chatService: ChatService) { }


  ngOnInit() {
  }

}
