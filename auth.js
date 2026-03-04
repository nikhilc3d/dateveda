import axios from "axios"

export default async function handler(req,res){

const code=req.query.code

const CLIENT_ID=process.env.CLIENT_ID
const CLIENT_SECRET=process.env.CLIENT_SECRET
const REDIRECT_URI=`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/auth`

try{

const token=await axios.post(
"https://www.linkedin.com/oauth/v2/accessToken",
new URLSearchParams({
grant_type:"authorization_code",
code:code,
redirect_uri:REDIRECT_URI,
client_id:CLIENT_ID,
client_secret:CLIENT_SECRET
}).toString(),
{headers:{"Content-Type":"application/x-www-form-urlencoded"}}
)

const access=token.data.access_token

const profile=await axios.get(
"https://api.linkedin.com/v2/userinfo",
{headers:{Authorization:"Bearer "+access}}
)

const u=profile.data

res.send(`
<h2>${u.name}</h2>
<p>${u.email}</p>
<img src="${u.picture}" width="80">
`)

}catch(e){

res.send("Login failed")

}


}

