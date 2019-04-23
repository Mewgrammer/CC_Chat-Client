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

  public language: IdentifiableLanguage;
  public languages: IdentifiableLanguage[] =  [];

  constructor(private _translationService: TranslationService, private _chatService: ChatService) {
  }

  async ngOnInit() {
    this.languages = IDENTIFYABLE_LANGUAGES.languages;
    this.language = this.languages.find(l => l.language == this._translationService.Language);
    console.log("initial Language:", this.language);
    this.languages = await this._translationService.Languages;
    if(this.languages.length == 0) {
      this.languages = [ this.language];
    }
    console.log("Languages:", this.languages);
  }

  onSelectionChange($event: MatSelectChange) {
    console.log("Lang changed to ", this.language);
    this._translationService.Language = this.language.language;
  }

  public getLanguageIconClass(lang: IdentifiableLanguage) {
    return "flag-icon flag-icon-" + lang.language;
  }
}
