import { IndexConfig } from '~/types/interface'

export const productIndex: IndexConfig = {
  name: 'products',

  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,

    analysis: {
      tokenizer: {
        edge_ngram_tokenizer: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
          token_chars: ['letter', 'digit']
        }
      },
      analyzer: {
        autocomplete: {
          type: 'custom',
          tokenizer: 'edge_ngram_tokenizer',
          filter: ['lowercase', 'asciifolding']
        },
        autocomplete_search: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'asciifolding']
        }
      }
    }
  },
  mappings: {
    properties: {
      name: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
          autocomplete: {
            type: 'text',
            analyzer: 'autocomplete',
            search_analyzer: 'autocomplete_search'
          }
        }
      },

      description: { type: 'text' },

      brand: { type: 'keyword' },

      category: { type: 'keyword' },

      price: { type: 'float' },

      rating: { type: 'float' },

      createdAt: { type: 'date' }
    }
  }
}
