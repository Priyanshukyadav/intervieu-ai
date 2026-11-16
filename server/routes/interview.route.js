import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { abandonInterview, analyzeResume, deleteMyInterview, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js"




const interviewRouter = express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",isAuth,generateQuestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)
interviewRouter.post("/abandon",isAuth,abandonInterview)

interviewRouter.get("/get-interview",isAuth,getMyInterviews)
interviewRouter.delete("/:id",isAuth,deleteMyInterview)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)



export default interviewRouter