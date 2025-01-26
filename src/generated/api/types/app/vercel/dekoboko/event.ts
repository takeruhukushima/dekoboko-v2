/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util'
import { lexicons } from '../../../../lexicons'
import { CID } from 'multiformats/cid'

export interface Record {
  /** The title of the event */
  title: string
  /** The description of the event */
  description: string
  /** Achievements for participating in events */
  achievement: string
  /** Client-declared timestamp when this event was originally created. */
  createdAt: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'app.vercel.dekoboko.event#main' ||
      v.$type === 'app.vercel.dekoboko.event')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('app.vercel.dekoboko.event#main', v)
}
