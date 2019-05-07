import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  public serverUrl = "";
  public errorMsg = "";
  private connectionLostSubscription: Subscription;

  public get ErrorMessage() {
    return this.errorMsg;
  }

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.serverUrl = this.chatService.ServerUrl;
    this.connectionLostSubscription = this.chatService.connectionLost.subscribe(
      () => {
        this.errorMsg = "No connection to Server !";
      }
    );
  }

  onSubmit() {
    this.errorMsg = "";
    this.connect(this.serverUrl);
  }

  connect(url: string) {
    this.chatService.connect(url);
  }

}
