import { Component, ViewChild } from '@angular/core';
import {ChatService} from './services/chat.service';
import { ChatRoom } from './Models/chat-room';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild("snav")
  private sideNav: MatSidenav;

  protected rooms: ChatRoom[] = [];
  private chatRoomsSubscription: Subscription;


  constructor(protected chatService: ChatService) {
    // this.chatService.login("AutoLogin-" + new Date().toString())
  }

  ngOnInit() {
    this.chatRoomsSubscription = this.chatService.chatRoomsChanged.subscribe((rooms) => {
      console.log("ChatRooms changed", rooms);
      this.rooms = rooms;
    });
    this.rooms = this.chatService.ChatRooms;
    console.log("Chat Rooms:", this.rooms);
  }

  onToggleSideNav() {
    this.sideNav.toggle();
  }

  onSelectRoom(room: ChatRoom) {
    this.chatService.changeChatRoom(room);
  }

}
