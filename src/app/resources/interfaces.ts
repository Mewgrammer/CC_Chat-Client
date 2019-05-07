export interface IdentifiableLanguage {
  /** The language code for an identifiable language. */
  language: string;
  /** The name of the identifiable language. */
  name: string;
}
export interface IdentifiableLanguages {
  /** A list of all languages that the service can identify. */
  languages: IdentifiableLanguage[];
}
/** IdentifiedLanguage. */
export interface IdentifiedLanguage {
  /** The language code for an identified language. */
  language: string;
  /** The confidence score for the identified language. */
  confidence: number;
}
/** IdentifiedLanguages. */
export interface IdentifiedLanguages {
  /** A ranking of identified languages with confidence scores. */
  languages: IdentifiedLanguage[];
}
/** Translation. */
export interface Translation {
  /** Translation output in UTF-8. */
  translation: string;
}

/** Response payload for models. */
export interface TranslationModel {
  /** A globally unique string that identifies the underlying model that is used for translation. */
  model_id: string;
  /** Optional name that can be specified when the model is created. */
  name?: string;
  /** Translation source language code. */
  source?: string;
  /** Translation target language code. */
  target?: string;
  /** Model ID of the base model that was used to customize the model. If the model is not a custom model, this will be an empty string. */
  base_model_id?: string;
  /** The domain of the translation model. */
  domain?: string;
  /** Whether this model can be used as a base for customization. Customized models are not further customizable, and some base models are not customizable. */
  customizable?: boolean;
  /** Whether or not the model is a default model. A default model is the model for a given language pair that will be used when that language pair is specified in the source and target parameters. */
  default_model?: boolean;
  /** Either an empty string, indicating the model is not a custom model, or the ID of the service instance that created the model. */
  owner?: string;
  /** Availability of a model. */
  status?: string;
}
/** The response type for listing existing translation models. */
export interface TranslationModels {
  /** An array of available models. */
  models: TranslationModel[];
}
/** TranslationResult. */
export interface TranslationResult {
  /** Number of words in the input text. */
  word_count: number;
  /** Number of characters in the input text. */
  character_count: number;
  /** List of translation output in UTF-8, corresponding to the input text entries. */
  translations: Translation[];
}
