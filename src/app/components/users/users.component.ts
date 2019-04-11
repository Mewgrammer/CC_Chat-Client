import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';
import {User} from '../../Models/user';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  private users: User[] = [];
  private currentRoomSubscription: Subscription;

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.currentRoomSubscription = this.chatService.currentRoomChanged.subscribe(
      room => {
        this.users = [...room.users];
      }
    );
    if (this.chatService.CurrentChatRoom != null) {
      this.users = this.chatService.CurrentChatRoom.users;
    }
  }
}
