require("dotenv").config()
const express = require('express')
const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/instagram", (req, res) => {
    res.send("<h2>Welcome to Instagram</h2>")
})

app.get("/twitter", (req, res) => {
    res.send("<h1>Welcome to Twitter</h1>")
})

app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${port}`);
})

