import jwt from 'jsonwebtoken'

const generateToken = (userId, farmId) => {
    return jwt.sign({ userId, farmId}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export default generateToken