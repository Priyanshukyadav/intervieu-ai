import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: string ,
        require: true
    },
    email: {
        type: string,
        require: true
    },
    credit: {
        type : Number,
        default: 100
    }
},{timestamps: true})

const User = mongoose.model( "User" ,UserSchema )

export default User