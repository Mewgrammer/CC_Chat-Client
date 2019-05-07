import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../../Models/message';
import {ChatService} from '../../../../services/chat.service';
import {UploadedFile} from '../../../../Models/uploaded-file';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-message-attachments',
  templateUrl: './message-attachments.component.html',
  styleUrls: ['./message-attachments.component.scss']
})
export class MessageAttachmentsComponent implements OnInit {

  @Input("message")
  set Message(msg: Message) {
    this.message = msg;
  }
  public message: Message;

  constructor(public chatService: ChatService) { }

  ngOnInit() {
  }

  async onDownloadAttachment(attachment: UploadedFile) {
    const blob = await this.chatService.downloadUploadedFile(attachment);
    saveAs(blob, attachment.displayName);
  }
}
