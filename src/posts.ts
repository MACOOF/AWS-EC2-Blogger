import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import sql from './neondb';

const post = new Hono();

async function Auth(c:any,next:any){
  const token = c.req.header('authorization');

  if(!(token && token.includes('Bearer '))){
    return Response.json({msg:"Token Required"});
  }

  const jwt = token.split(" ")[1];
  console.log(token);
  try{
    const decodedPayload = await verify(jwt,"sarthak");
    c.set('user',decodedPayload);
    await next();
  }catch(e){
    c.status(411);
    return Response.json({msg:"Unatherized user"});
  }
}

post.use(Auth);

post.get("/",async(c)=>{
  const posts = await sql("SELECT * FROM blogpost ORDER BY id;");

  return Response.json({posts});
});

post.post('/',async(c)=>{
  const { title, body } = await c.req.parseBody();

  if(!(title && body)){
    return c.json({msg:"Invalid Inputes"},411);
  }

  const responce = await sql("INSERT INTO blogpost(title, body) VALUES($1,$2)",[title,body]);

  return c.json({msg:"Blog Created!!"},200);
});


post
  .get('/:id',async(c)=>{
    const { id } = c.req.param();

    if(!id){
      return c.json({msg:"ID Required as query"},411);
    }

    const responce = await sql('SELECT * FROM blogpost WHERE id=$1',[id]);

    if(responce.length===0)
      return c.json({msg:"Post Not found"},200);

    return c.json({post:responce},200);
  })
  .put('/:id',async(c)=>{
    const { id }= c.req.param();

    if(!id){
      return c.json({msg:"ID Required as query"},411);
    }

    const { title, body } = await c.req.parseBody();

    if(!(title && body && id)){
      return c.json({msg:"Invalid Inputes"},411);
    }

    const responce = await sql('SELECT * FROM blogpost WHERE id=$1',[id]);

    if(responce.length===0)
      return c.json({msg:"Post Not found"},200);

    const responce1 = await sql('UPDATE blogpost SET title=$1, body=$2 WHERE id=$3',[title,body,id]);

    return c.json({msg:"Successfully updated"},200);
  })
  .delete('/:id',async(c)=>{
    const { id }= c.req.param();

    if(!id){
      return c.json({msg:"ID Required as query"},411);
    }

    const responce = await sql('SELECT * FROM blogpost WHERE id=$1',[id]);

    if(responce.length===0)
      return c.json({msg:"Post Not found"},200);

    const responce1 = await sql('DELETE FROM blogpost WHERE id=$1',[id]);

    return c.json({msg:"Successfully deleted"},200);
  })


export default post;

