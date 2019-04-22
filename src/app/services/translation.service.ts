import { Injectable } from '@angular/core';
import {Translator} from '../resources/translator';
import {IMessage} from '../Models/message';
import {IUser} from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private readonly _translator: Translator;

  public get Translator() {
    return this._translator;
  }

  public get Languages() {
    return this._translator.getSupportedLanguages();
  }

  constructor() {
    this._translator = new Translator();
  }

  public translate(receiver: IUser, message: IMessage) {

  }
}
