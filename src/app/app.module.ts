import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatSelectModule,
  MatToolbarModule,
  MatSidenavModule, MatTabsModule, MatTooltipModule, MatProgressBarModule
} from '@angular/material';
import {ChatComponent} from './components/chat/chat.component';
import {RoomsComponent} from './components/rooms/rooms.component';
import {UsersComponent} from './components/users/users.component';
import {HeaderComponent} from './components/header/header.component';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ChatMessageComponent } from './components/chat/chat-message/chat-message.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ServerMessageComponent } from './components/chat/chat-message/server-message/server-message.component';
import { PrivateMessageComponent } from './components/chat/chat-message/private-message/private-message.component';
import { BroadcastMessageComponent } from './components/chat/chat-message/broadcast-message/broadcast-message.component';
import {HttpClientModule} from '@angular/common/http';
import { MessageAttachmentsComponent } from './components/chat/chat-message/message-attachments/message-attachments.component';
import { ConnectComponent } from './components/connect/connect.component';
import { RegisterComponent } from './components/register/register.component';
import { LanguagePickerComponent } from './components/language-picker/language-picker.component';
import {AvatarModule} from 'ng2-avatar';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    RoomsComponent,
    UsersComponent,
    HeaderComponent,
    LoginComponent,
    ChatMessageComponent,
    ServerMessageComponent,
    PrivateMessageComponent,
    BroadcastMessageComponent,
    MessageAttachmentsComponent,
    ConnectComponent,
    RegisterComponent,
    LanguagePickerComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,

    AvatarModule.forRoot(),

    // Angular Material
    ScrollingModule,
    MatToolbarModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
