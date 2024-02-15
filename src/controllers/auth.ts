import { error } from "console";
import { RequestHandler } from "express";
import { z } from "zod";

import * as auth from '../services/auth'

export const login: RequestHandler = (req,res) => {
    const loginSchema = z.object({
        password: z.string()
    })
    const body = loginSchema.safeParse(req.body)
    if(!body.success) return res.json({error: 'Dados inválidos, verifique!!!'})

    // validar a senha & gerar o token
    if(!auth.validatePassword(body.data.password)) {
        return res.status(403).json({error: 'Acesso Negado, verifique a senha de acesso!!!'})
    }

    res.json({ token: auth.createToken() })
}

export const validate: RequestHandler = (req,res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({error: 'Acesso Negado, verifique a senha de acesso!!!'})
    }

    // pegar o tokem : split('')[1] --> pega o segundo item do array [token,numero do token]
    const token = req.headers.authorization.split(' ')[1]
    if(!auth.validateToken(token)){
        return res.status(403).json({error: 'Acesso Negado, verifique a senha de acesso!!!'})
    }

    next()    
}