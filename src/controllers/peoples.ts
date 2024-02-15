import { RequestHandler } from "express";

import * as peoples from '../services/peoples'
import { z } from "zod";
import { decrypMatch } from "../utils/match";

//pega todas as pessoas daquele evento/grupo
export const getAll: RequestHandler = async (req,res) => {
    const {id_event, id_group} = req.params

    const items = await peoples.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })
    if(items) return res.json({peoples: items})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}
//busca uma pessoa especifica no evento/grupo
export const getPerson: RequestHandler = async (req,res) => {
    const {id_event,id_group,id_people} = req.params

    const personItem = await peoples.getOne({
        id: parseInt(id_people),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })

    if(personItem) return res.json({peoples: personItem})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}
//inclui uma pessoa no evento/grupo
export const addPerson: RequestHandler = async (req,res) => {
    const {id_event,id_group} = req.params

    const addPersonSchema = z.object({
        name: z.string(),
        cpg: z.string().transform(val => val.replace(/\.|-/gm, ''))
    })

    const body = addPersonSchema.safeParse(req.body)

    if(!body.success) return res.json({error: 'Dados inválidos, verique!!!'})
    //console.log(body)
    //console.log(id_group)
    //console.log(id_event)
    const newPerson = await peoples.add({
        name: body.data.name,
        cpg: body.data.cpg,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })
    //console.log(newPerson)
    if(newPerson) return res.status(201).json({peoples: newPerson})

    res.json({error: 'Ocorreu um erro ao cadastrar uma pessoa, verifique!!!'})
}
//atualiza os dados da pessoa
export const updatePerson: RequestHandler = async (req,res) => {
    const {id_event , id_group,id_people } = req.params
    //console.log(id_group)
    //console.log(id_event)
    //console.log(id_people)
    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpg: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    })
    const body = updatePersonSchema.safeParse(req.body)
    //console.log(req.body)
    //console.log(req.params)
    if(!body.success) return res.json({error: 'Dados inválidos, verique!!!'})

    const UpdatedPerson = await peoples.update({
        id: parseInt(id_people),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    }, body.data)

    if(UpdatedPerson) {
        
        const personItem = await peoples.getOne({
            id:parseInt(id_people),
            id_event: parseInt(id_event)
        })
        
        return res.status(201).json({peoples: personItem})
    }
    res.json({error: 'Ocorreu um erro ao alterar uma pessoa, verifique!!!'})
}
//exclui uma pessoa do evento/grupo
export const deletePerson: RequestHandler = async (req,res) => {
    const {id_event , id_group,id_people } = req.params

    const deletedPerson = await peoples.remove({
        id: parseInt(id_people),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })

    if(deletedPerson) return res.json({peoples: deletePerson})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}
//pesquisa a pessoa que fez o sorteio e quem foi o sorteado pelo mesmo
export const searchPerson: RequestHandler = async (req,res) => {
    const {id_event} = req.params

    const searchPersonSchema = z.object({
        cpf:z.string().transform(val => val.replace(/\.|-/gm, ''))
    })
    //encontra o cpf cadastrado
    const query = searchPersonSchema.safeParse(req.query)
    if(!query.success) return res.json({error: 'Dados inválidos, verique!!!'})
    
    //encontra os dados da pessoa do respectivo cpf
    const personItem = await peoples.getOne({
        id_event: parseInt(id_event),
        cpg: query.data.cpf
    })
    //se encontrou o CPF e(&&) se o sorteio foi realizado para o evento
    if(personItem && personItem.matched){
        const matchId = decrypMatch(personItem.matched)
        //pegar pelo id a pessoa que foi tirada no sorteio
        const personMatched = await peoples.getOne({
            id_event: parseInt(id_event),
            id: matchId
        })
        //retona os dados da pessoa que fez o sorteio e do sorteado
        if(personMatched){
            return res.json({
                person:{
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched:{
                    id: personMatched.id,
                    name: personMatched.name
                }
            })
        }
    }

    res.json({error: 'Ocorreu um erro, verifique!!!'})

}