import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import user from './user';
import post from './posts';

const app = new Hono();

app.route('/users',user);
app.route('/posts',post);

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
