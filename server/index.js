import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectedDb.js"
dotenv.config() 

const app = express()

app.listen(process.env.PORT || 6000, () => {
    console.log("server running");
    connectDB() 
})