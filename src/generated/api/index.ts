/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { XrpcClient, FetchHandler, FetchHandlerOptions } from '@atproto/xrpc'
import { schemas } from './lexicons'
import { CID } from 'multiformats/cid'
import * as AppVercelDecobokoPost from './types/app/vercel/decoboko/post'

export * as AppVercelDecobokoPost from './types/app/vercel/decoboko/post'

export class AtpBaseClient extends XrpcClient {
  app: AppNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.app = new AppNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class AppNS {
  _client: XrpcClient
  vercel: AppVercelNS

  constructor(client: XrpcClient) {
    this._client = client
    this.vercel = new AppVercelNS(client)
  }
}

export class AppVercelNS {
  _client: XrpcClient
  decoboko: AppVercelDecobokoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.decoboko = new AppVercelDecobokoNS(client)
  }
}

export class AppVercelDecobokoNS {
  _client: XrpcClient
  post: PostRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.post = new PostRecord(client)
  }
}

export class PostRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: AppVercelDecobokoPost.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.vercel.decoboko.post',
      ...params,
    })
    return res.data
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: AppVercelDecobokoPost.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.vercel.decoboko.post',
      ...params,
    })
    return res.data
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: AppVercelDecobokoPost.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = 'app.vercel.decoboko.post'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection: 'app.vercel.decoboko.post', ...params, record },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.vercel.decoboko.post', ...params },
      { headers },
    )
  }
}
