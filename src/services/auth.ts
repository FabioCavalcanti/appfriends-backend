import { getToday } from "../utils/getToday"

export const validatePassword = (password: string): boolean => {
    // 10/10/2030
    // [10,10,2030] split
    // 10102030 join
    const currentPassword = getToday().split('/').join('')
    return password === currentPassword
}

export const createToken = () => {
    const currentPassword = getToday().split('/').join('')
    return `${process.env.DEFAULT_TOKEN}@${currentPassword}`
}

export const validateToken = (token: string) => {
    const currentToken = createToken()
    return token === currentToken
}