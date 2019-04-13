import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private username = "";
  private password = "";
  private errorMsg = "";
  private RegistrationFailedSubscription: Subscription;

  public get ErrorMessage() {
    return this.errorMsg;
  }

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.RegistrationFailedSubscription = this.chatService.loginRefused.subscribe(
      msg => {
        this.errorMsg = msg;
      }
    );
  }

  async onSubmit() {
    this.errorMsg = "";
    await this.register(this.username, this.password);
  }

  async register(username: string, password: string) {
    await this.chatService.register(username, password);
  }

}
