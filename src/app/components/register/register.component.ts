import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../../services/chat.service';
import {AvatarComponent} from 'ng2-avatar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild(AvatarComponent)
  public avatar: AvatarComponent;

  public imgSrc = "";
  public username = "";
  public password = "";
  public errorMsg = "";


  @ViewChild("fileInput")
  public _fileInput: ElementRef;
  public file: File;

  private RegistrationFailedSubscription: Subscription;

  public get ErrorMessage() {
    return this.errorMsg;
  }

  constructor(protected chatService: ChatService) {}

  ngOnInit() {
    this.RegistrationFailedSubscription = this.chatService.registrationFailed.subscribe(
      msg => {
        this.errorMsg = msg;
      }
    );
  }

  onFileInput() {
    if(this._fileInput.nativeElement.files && this._fileInput.nativeElement.files[0]) {
      const files: { [key: string]: File } = this._fileInput.nativeElement.files;
      this.file = files[0];
      const reader = new FileReader();
      reader.onload = e => this.imgSrc = <string>reader.result;
      reader.readAsDataURL(this.file);
    }

  }

  async onSubmit() {
    this.errorMsg = "";
    await this.register(this.username, this.password);
  }

  async register(username: string, password: string) {
    await this.chatService.register(username, password, this.file);
  }

}
