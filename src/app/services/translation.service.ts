import { Injectable } from '@angular/core';
import {IMessage} from '../Models/message';
import {IUser} from '../Models/user';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {IdentifiableLanguage, IdentifiableLanguages, IdentifiedLanguages, TranslationResult} from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
//OBSOLETE - DIDNT WORK ... THANKs CORS!!!!
export class TranslationService {

  private _languages: IdentifiableLanguage[] = [];
  private _targetLanguage: string = "de";

  public get Language() {
    return this._targetLanguage;
  }

  public set Language(lang: string) {
    this._targetLanguage = lang;
  }

  constructor(private _http: HttpClient) {

  }

  public get Languages() {
    return this.getSupportedLanguages();
  }

  private get AuthHeader() {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa("apikey:" + environment.translatorApiKey));
    return headers;
  }

  private get HttpParams() {
    return  new HttpParams().set('version', environment.translatorVersion);
  }

  public async getSupportedLanguages(): Promise<IdentifiableLanguage[]> {
    if(this._languages.length == 0) {
      try{
        const url = environment.translatorUrl + "/identifiable_languages";
        const header = this.AuthHeader.append('Content-Type', 'application/json');
        this._languages = ((await this._http.get(url, {
          headers: header,
          withCredentials: true,
          params: this.HttpParams
        }).toPromise()) as IdentifiableLanguages).languages;
        console.log("Identifiable Languages:", this._languages);
      }
      catch (e) {
        console.error("Getting identifiable languages failed:", e);
      }
    }
    return this._languages;
  }

  public async identifyLanguage(text: string): Promise<IdentifiedLanguages> {
    let header = this.AuthHeader.append('Content-Type', 'text/plain');
    const url = environment.translatorUrl + "/identify";
    return (await this._http.post(url, text, {
      headers: header,
      withCredentials: true,
      params: this.HttpParams
    }).toPromise()) as IdentifiedLanguages;
  }

  public async translate(receiver: IUser, message: IMessage) {
    const sourceLangRanking = await this.identifyLanguage(message.content);
    console.log("Identified Languages for '" + message.content + "'", sourceLangRanking);
    const header = this.AuthHeader.append('Content-Type', 'application/json');
    const url = environment.translatorUrl + "/translate";
    const body = {
      text: [message.content],
      source: sourceLangRanking.languages[0].language,
      target: this._targetLanguage
    };
    console.log("Translating", body);
    return (await this._http.post(url, body, {
      headers: header,
      withCredentials: true,
      params: this.HttpParams
    }).toPromise()) as TranslationResult;  }
}
