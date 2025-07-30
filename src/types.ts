export interface WordDefinition {
  word: string;
  entries: {
    language: {
      code: string;
      name: string;
    };
    partOfSpeech: string;
    pronunciations: {
      type: string;
      text: string;
      tags: string[];
    }[];
    forms: {
      word: string;
      tags: string[];
    }[];
    senses: {
      definition: string;
      tags: string[];
      examples: string[];
      quotes: {
        text: string;
        reference: string;
      }[];
      synonyms: string[];
      antonyms: string[];
      translations?: {
        language: {
          code: string;
          name: string;
        };
        word: string;
      }[];
      subsenses?: {
        definition: string;
        tags: string[];
        examples: string[];
        quotes: {
          text: string;
          reference: string;
        }[];
        synonyms: string[];
        antonyms: string[];
        translations?: {
          language: {
            code: string;
            name: string;
          };
          word: string;
        }[];
        subsenses?: any[]; // prevent infinite recursion, or use Sense[] if defined separately
      }[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  source: {
    url: string;
    license: {
      name: string;
      url: string;
    };
  };
}
