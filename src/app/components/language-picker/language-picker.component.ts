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
    return this._chatService.Languages.filter(l => this.languageMapping.has(l.language));
  }

  private languageMapping: Map<string, string> = new Map();


  constructor(private _chatService: ChatService) {

  }

  private mapLanguageTags() {
    this.languageMapping.set("af", "za");
    this.languageMapping.set("ar", "ae");
    this.languageMapping.set("de", "de");
    this.languageMapping.set("en", "gb");
    this.languageMapping.set("tr", "tr");
    this.languageMapping.set("sw", "sw");
    this.languageMapping.set("fr", "fr");
    this.languageMapping.set("fi", "fi");
    this.languageMapping.set("hu", "hu");
    this.languageMapping.set("it", "it");
    this.languageMapping.set("pl", "pl");
    this.languageMapping.set("ja", "jp");
    this.languageMapping.set("cs", "cz");
    this.languageMapping.set("es", "es");
    this.languageMapping.set("nl", "nl");
    this.languageMapping.set("pt", "pt");

  }

  ngOnInit() {
    this._chatService.languageChanged.subscribe( (lang) => {
      this.language = this.Languages.find(l => l.language == lang.language);
    });
    this.language = this.Languages.find(l => l.language == this._chatService.Language);
    this.mapLanguageTags();
  }

  onSelectionChange($event: MatSelectChange) {
    console.log("Lang changed to ", this.language);
    this._chatService.changeLanguage(this.language.language);
  }

  public getLanguageIconClass(lang: IdentifiableLanguage) {
    if(lang != null) {
      const languageIdentifier = this.languageMapping.get(lang.language);
      return "flag-icon flag-icon-" + languageIdentifier;
    }
  }



}
