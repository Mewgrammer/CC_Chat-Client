import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public username = "";
  public password = ""
  public errorMsg = "";
  public loading = false;

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
    try{
      this.loading = true;
      await this.login(this.username, this.password);

    }
    catch(err) {
      console.error("error on Login Submit", err);
    }
    finally {
      this.loading = false;
    }
  }

  async login(username: string, password: string) {
    await this.chatService.login(username, password);
  }
}
