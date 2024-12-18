const express = require("express");
const cors = require('cors');
require("./db/conn");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userrouter = require('./router/userroute');
const roomsrouter = require('./router/roomsroute');

const app = express();
const PORT = process.env.PORT||8000;
app.use(cookieParser());
app.use(
    cors({
        origin: `${process.env.LOCALPATH}`,
        methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
        credentials: true
    })
)


app.use(express.json());
app.use("/users" , userrouter);
app.use("/rooms",roomsrouter);



app.listen(PORT , ()=>{
    console.log(`Listening on the port Number ${PORT}`);
})

