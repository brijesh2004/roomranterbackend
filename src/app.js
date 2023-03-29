const express = require("express");
const app = express();
require("./db/conn");

app.use(express.json());
app.use(require('./router/auth'));


app.get("/",(req , res)=>{
  res.send("Hello from the home side");
})

app.listen(7000 , ()=>{
    console.log(`Listening on the port Number 7000`);
})

