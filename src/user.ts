import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import sql from './neondb';

const user = new Hono();

user.post('/signup',async (c) => {
  const { username,email,password } = await c.req.parseBody(); // url encoded

  const userexist =await sql("SELECT * FROM Bloguser WHERE email=$1;",[email]);

  if(userexist.length>0){
    return Response.json({msg:"Email all ready exist"});
  }
  const responce:any = await sql("INSERT INTO Bloguser(username,email,password) Values($1,$2,$3) RETURNING id;",[username,email,password],    {arrayMode:true });

  const token = await sign({id:responce[0].id},'sarthak');

  return Response.json({token:token});
});


user.post('/signin',async(c)=>{
  const { email,password } = await c.req.parseBody();

  const userexist:any =await sql("SELECT * FROM Bloguser WHERE email=$1;",[email]);

  if(userexist.length===0){
    return Response.json({msg:"User Does not exist"});
  }

  console.log(userexist);

  if(userexist[0].password==password || userexist[0].email==email){
    const token = await sign({id:userexist[0].id},'sarthak');
    
    return Response.json({token:token}); 
  }else{   
    return Response.json({msg:"Invalid Email or Password"});
  }
});

export default user;