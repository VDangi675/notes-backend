const express = require("express")
const { default: mongoose } = require("mongoose")
const mongodb = require("mongodb")
const app = express()


const port = process.env.port || 5000

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "config.env" })
}
app.use(express.json())




mongoose.connect("mongodb+srv://VIKAS:VIKAS@cluster0.n97bpmk.mongodb.net/?retryWrites=true&w=majority").then(() => console.log("connected to db"))



const User = require("./routes/User")
const Notes = require("./routes/Note")
app.use(User);
app.use(Notes);



if (process.env.NODE_ENV === 'production') {
    //*Set static folder
    app.use(express.static('client/build'));
    
    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
  }


app.listen(port, console.log(`server is on ${port}`))


