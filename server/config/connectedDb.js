import mongoose from "mongoose";


const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL) ;
        console.log("DataBase connected") ;
        
    } catch (error) {
        console.log(`message error is ${error}`) ;
    }
}

export default connectDB