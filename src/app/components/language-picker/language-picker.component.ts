import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {ChatService} from '../../services/chat.service';
import {IDENTIFYABLE_LANGUAGES} from '../../resources/testData';
import {IdentifiableLanguage, IdentifiedLanguage} from '../../resources/interfaces';
import {MatSelectChange} from '@angular/material';

@Component({
  selector: 'app-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss']
})
export class LanguagePickerComponent implements OnInit {

  public language: IdentifiableLanguage = {
    language: "de",
    name: "German"
  };

  public get Languages() {
    return this._chatService.Languages;
  }

  constructor(private _chatService: ChatService) {

  }

  ngOnInit() {
    this._chatService.languageChanged.subscribe( (lang) => {
      this.language = this.Languages.find(l => l.language == lang.language);
    });
    this.language = this.Languages.find(l => l.language == this._chatService.Language);
  }

  onSelectionChange($event: MatSelectChange) {
    console.log("Lang changed to ", this.language);
    this._chatService.changeLanguage(this.language.language);
  }

  public getLanguageIconClass(lang: IdentifiableLanguage) {
    return "flag-icon flag-icon-" + lang.language;
  }
}
