import React from 'react'
import { FaRobot } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
function Auth() {
    const handleGoogleSignIn = async () => {
        try{
            const response = await signInWithPopup(auth, provider);
            console.log(response);

        }catch(error){
            console.log(error);

        }
    }
  return (
    <div className='w-full min-h-screen bg-gray-100 flex items-center 
    justify-center px-6 py-20'>
        <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border-gray-200'>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <FaRobot size={18}/>
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>Intervieu-AI</h2>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
            Continue with(" ")
            <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                <IoSparklesSharp size={18} />
                AI Smart Interview
            </span>
        </h1>
        <p className='text-gray-600 text-center'>
            Welcome to Intervieu-AI, your AI-powered interview assistant!
        </p>
        <motion.button
        onClick={handleGoogleSignIn}
        whileHover={{ opacity: 0.9,scale: 1.051 }}
        whileTap={{ opacity: 1,scale: 0.95 }}
        className='w-full flex items-center 
        justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md'>
            <FcGoogle size={20}/>
            Continue with Google

        </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth