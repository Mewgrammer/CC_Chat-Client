import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../../Models/message';
import {ChatService} from '../../../../services/chat.service';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent implements OnInit {

  @Input("message")
  set Message(msg: Message) {
    this.message = msg;
  }
  public message: Message;

  constructor(protected chatService: ChatService) { }


  ngOnInit() {
  }

  public isHappy(): boolean {
    return this.message != null && this.message.mood == "happy";
  }

  public getRecipientsListAsString(): string {
    return this.message.recipients.map(r => r.name).join(",");
  }

}
