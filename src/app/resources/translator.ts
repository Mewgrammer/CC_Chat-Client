import * as LanguageTranslatorV3 from 'ibm-watson/language-translator/v3';
import {environment} from '../../environments/environment';
import {IdentifiableLanguage} from 'ibm-watson/language-translator/v3';


export class Translator {
  private _translator: LanguageTranslatorV3;
  private _languages: IdentifiableLanguage[] = [];
  constructor() {
    this._translator = new LanguageTranslatorV3({
      iam_apikey: environment.translatorApiKey,
      url: environment.translatorUrl,
      version: environment.translatorVersion,
    });
  }

  public async getSupportedLanguages(): Promise<IdentifiableLanguage[]> {
    if(this._languages.length == 0) {
      this._languages = (await this._translator.listIdentifiableLanguages()) as IdentifiableLanguage[];
    }
    return this._languages;
  }

  public translate(text: string, targetLanguage: string, sourceLanguage: string = "de") {
    this._translator.translate(
      {
        text: [text],
        source: sourceLanguage,
        target: targetLanguage
      },
      (err, translation) => {
        if (err)  {
          console.log('error:', err);
        } else  {
          console.log(JSON.stringify(translation, null, 2));
        }
      }
    );
  }

  public identifyLanguage(text: string) {
    this._translator.identify(
      {
        text: text
      },
      function(err, language) {
        if (err)  {
          console.warn('error on translate:', err);
        } else {
          console.log(JSON.stringify(language, null, 2));
        }
      }
    );
  }


}






