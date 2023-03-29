const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE;
mongoose.connect('mongodb+srv://brijesh123:RoomSearch2023@cluster0.ojzxsmf.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
}).then(() => {
    console.log("Connection successfull");
}).catch((err) => {
    console.log("no connection");
})
