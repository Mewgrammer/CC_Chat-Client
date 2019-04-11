import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private username = "";
  private errorMsg = "";
  private loginRefusedSubscription: Subscription;
  private connectionLostSubscription: Subscription;
  private connectionEstablishedSubscription: Subscription;

  public get ErrorMessage() {
    return this.errorMsg;
  }

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.loginRefusedSubscription = this.chatService.loginRefused.subscribe(
      msg => {
        this.errorMsg = msg;
      }
    );
    this.connectionLostSubscription = this.chatService.connectionLost.subscribe(
      () => {
        this.errorMsg = "No connection to Server !";
      }
    );
    this.connectionEstablishedSubscription = this.chatService.connectionEstablished.subscribe(
      () => {
        this.errorMsg = "";
      }
    );
  }

  onSubmit() {
    this.errorMsg = "";
    this.login(this.username);
  }

  login(username: string) {
    this.chatService.login(username);
  }
}
