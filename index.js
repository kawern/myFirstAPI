require("dotenv").config();

const express = require("express")

const cors = require("cors")

const formidable = require("express-formidable")

const animals = require("./routes/animals")

const food = require("./routes/food")

const acc = require("./routes/acc")

// set up express app
const app = express();

// import db-connection
require("./database")

app.use("/", express.static('docs'))

// allow requests from other origins
app.use(cors())

// pass http form data
app.use(formidable())

//set up app routes
app.use("/api/v1", animals, food, acc)

app.listen(process.env.PORT || 4000, function () { 
    console.log("now listening for requests on port 4000");
})