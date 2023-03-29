const express = require("express");
const app = express();
require("./db/conn");
const PORT = process.env.PORT||7000

app.use(express.json());
app.use(require('./router/auth'));


app.get("/",(req , res)=>{
  res.send("Hello from the home side");
})

app.listen(PORT , ()=>{
    console.log(`Listening on the port Number ${PORT}`);
})

