import React from 'react'
import { useState } from 'react'
import { Suspense, lazy } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'
import CandidateVideoRecorder from '../components/interview/CandidateVideoRecorder'

const DsaCodingInterview = lazy(() => import('../components/DsaCodingInterview'))

function InterviewPage() {
    const [step,setStep] = useState(1)
    const [interviewData,setInterviewData] = useState(null)

  return (
    <div className='min-h-screen bg-gray-50'>
        {step===1 && (
            <Step1SetUp onStart={(data)=>{
                setInterviewData(data);
            setStep(2)}}/>
        )}

         {step === 2 && interviewData?.mode === "DSA" && (
            <Suspense fallback={<div className="p-8 text-center text-gray-600">Loading code editor…</div>}>
                <DsaCodingInterview onExit={() => setStep(1)} />
            </Suspense>
         )}

         {step >= 2 && interviewData?.mode !== "DSA" && (
            <div className={step === 2
                ? "grid min-h-screen grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,4fr)_minmax(240px,1fr)]"
                : ""}>
                {step === 2 ? (
                    <Step2Interview interviewData={interviewData}
                        onExit={() => {
                            setInterviewData(null)
                            setStep(1)
                        }}
                        onFinish={(report) => {
                            setInterviewData(report)
                            setStep(3)
                        }}
                    />
                ) : (
                    <Step3Report report={interviewData} />
                )}
                <CandidateVideoRecorder
                    embedded={step === 2}
                    isInterviewFinished={step === 3}
                />
            </div>
        )}

        {step === 3 && interviewData?.mode === "DSA" && (
            <Step3Report report={interviewData} />
        )}

      
    </div>
  )
}

export default InterviewPage
