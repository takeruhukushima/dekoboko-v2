import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { createClient } from '@/app/lib/auth/client'
import { getIronSession } from 'iron-session'

const app = new Hono().basePath('/api');
const client = await createClient();

type Session = { did: string };

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Decoboko API! by HogeFugaPiyoDango',
  })
}).get('/auth/callback', async (c) => {
    const params = new URLSearchParams(c.req.url.split('?')[1]);
    const { session } = await client.callback(params);

    const clientSession = await getIronSession<Session>(c.req.raw, c.res, {
      cookieName: 'sid',
      password: process.env.COOKIE_SECRET!,
    })
    
    clientSession.did = session.did;
    await clientSession.save();

    return c.redirect('/');
}).post('/auth', async (c) => {
  const body = await c.req.json();

  const handle = body.handle;

  console.log(handle)
  const url = await client.authorize(handle, {
    scope: 'atproto transition:generic',
  })
  
  return c.redirect(url.toString())
});

export const GET = handle(app)
export const POST = handle(app)