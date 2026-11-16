import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectedDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import codeRouter from "./routes/code.route.js"

const app = express()
const isProduction = process.env.NODE_ENV === "production"
const allowedOrigins = (process.env.CLIENT_URL || (isProduction ? "" : "http://localhost:5173"))
    .split(",")
    .map(origin => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)

if (allowedOrigins.length === 0) {
    throw new Error("Set CLIENT_URL to the deployed client origin.")
}

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error("Origin is not allowed by CORS."))
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/code", codeRouter)

const PORT = process.env.PORT || 8000

const startServer = async () => {
    await connectDb()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer().catch(error => {
    console.error("Failed to start server:", error)
    process.exit(1)
})
