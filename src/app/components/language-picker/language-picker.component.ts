import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss']
})
export class LanguagePickerComponent implements OnInit {

  public language: string = "de";

  public languages =  [];

  public get CurrentLanguage() {
    return this._chatService.LoggedIn ? this._chatService.User.language: this.language;
  }

  constructor(private _translationService: TranslationService, private _chatService: ChatService) {
  }

  async ngOnInit() {
    this.languages = await this._translationService.Languages;
  }

  onSelectionChange() {
    console.log("Lang changed to ", this.language);
    this._translationService.Language = this.language;
  }
}
