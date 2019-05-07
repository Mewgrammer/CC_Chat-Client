import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ChatRoom} from '../../Models/chat-room';
import {Subscription} from 'rxjs';

@Component({
  selector: "app-rooms",
  templateUrl: "./rooms.component.html",
  styleUrls: ["./rooms.component.css"]
})
export class RoomsComponent implements OnInit {
  public rooms: ChatRoom[] = [];
  private chatRoomsSubscription: Subscription;

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.chatRoomsSubscription = this.chatService.chatRoomsChanged.subscribe(
      rooms => {
        this.rooms = rooms;
      }
    );
    this.rooms = this.chatService.ChatRooms;
    console.log("Public Chat Rooms:", this.rooms);
  }

  onSelectRoom(room: ChatRoom) {
    this.chatService.changeChatRoom(room);
  }
}
