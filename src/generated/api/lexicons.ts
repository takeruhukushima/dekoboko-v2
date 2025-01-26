/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from '@atproto/lexicon'

export const schemaDict = {
  AppVercelDekobokoEvent: {
    lexicon: 1,
    id: 'app.vercel.dekoboko.event',
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        record: {
          type: 'object',
          required: ['title', 'description', 'achievement', 'createdAt'],
          properties: {
            title: {
              type: 'string',
              description: 'The title of the event',
            },
            description: {
              type: 'string',
              description: 'The description of the event',
            },
            achievement: {
              type: 'string',
              description: 'Achievements for participating in events',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this event was originally created.',
            },
          },
        },
      },
    },
  },
  AppVercelDekobokoPost: {
    lexicon: 1,
    id: 'app.vercel.dekoboko.post',
    defs: {
      main: {
        type: 'record',
        description: 'Record containing a dekoboko post.',
        key: 'tid',
        record: {
          type: 'object',
          required: ['text', 'createdAt'],
          properties: {
            text: {
              type: 'string',
              maxLength: 3000,
              maxGraphemes: 300,
              description: 'The primary post content.',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description:
                'Client-declared timestamp when this post was originally created.',
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>

export const schemas = Object.values(schemaDict)
export const lexicons: Lexicons = new Lexicons(schemas)
export const ids = {
  AppVercelDekobokoEvent: 'app.vercel.dekoboko.event',
  AppVercelDekobokoPost: 'app.vercel.dekoboko.post',
}
