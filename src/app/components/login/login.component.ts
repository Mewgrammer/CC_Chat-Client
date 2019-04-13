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
  private password = ""
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
        this.chatService.autoLogin();
        this.errorMsg = "";
      }
    );
    if(this.chatService.Connected) {
      this.chatService.autoLogin();
    }
  }

  async onSubmit() {
    this.errorMsg = "";
    await this.login(this.username, this.password);
  }

  async login(username: string, password: string) {
    await this.chatService.login(username, password);
  }
}
