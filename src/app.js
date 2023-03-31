const express = require("express");
const cors = require("cors");
const app = express();
require("./db/conn");
const PORT = process.env.PORT||7000

app.use(express.json());
app.use(require('./router/auth'));

app.use(
  cors({
    credentials:true,
    origin:['https://master--ornate-kheer-5bbba7.netlify.app/'],
    methods:['GET','POST'],
  })
)
app.get("/",(req , res)=>{
  res.send("Hello from the home side");
})

app.listen(PORT , ()=>{
    console.log(`Listening on the port Number ${PORT}`);
})

