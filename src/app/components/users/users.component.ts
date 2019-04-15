import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';
import {EMood, IUser, User} from '../../Models/user';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  private users: User[] = [];
  private currentRoomSubscription: Subscription;

  public get Moods() {
    return EMood;
  }

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.currentRoomSubscription = this.chatService.currentRoomChanged.subscribe(
      room => {
        this.users = [...room.users];
        console.log("Users updated", this.users);
      }
    );
    if (this.chatService.CurrentChatRoom != null) {
      this.users = this.chatService.CurrentChatRoom.users;
    }
  }

  public getMoodIconClass(user: IUser) {
    console.log(user.name + "Mood: " +user.mood);
    return user.mood == EMood.Unhappy ? "far fa-sad-cry text-danger" : user.mood == EMood.Happy ? "far fa-laugh-beam text-success" : "";
  }
}
