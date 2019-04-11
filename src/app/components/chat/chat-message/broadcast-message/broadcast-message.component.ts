import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../../Models/message';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.scss']
})
export class BroadcastMessageComponent implements OnInit {

  @Input("message")
  set Message(msg: Message) {
    this.message = msg;
  }
  public message: Message;

  constructor(protected chatService: ChatService) { }

  ngOnInit() {
  }

}
