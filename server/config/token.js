import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    const secret = process.env.JWT_SECRET_KEY
    if (!secret) {
        throw new Error("JWT_SECRET_KEY is not configured")
    }

    return jwt.sign({userId} , secret , {expiresIn:"7d"})
}

export default genToken