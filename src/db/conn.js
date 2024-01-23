const mongoose = require("mongoose");
require('dotenv').config();
const DB = process.env.DBPATH;
mongoose.connect(`${DB}`, {
    useNewUrlParser: true,
    // useCreateIndex:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
}).then(() => {
    console.log("Connection successfull");
}).catch((err) => {
    console.log("no connection");
})
