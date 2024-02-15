import { RequestHandler } from "express";
import * as groups from '../services/groups'
import { z } from "zod";

export const getAll: RequestHandler = async (req,res) =>{
    const {id_event} = req.params

    const items = await groups.getAll(parseInt(id_event))
    if(items) return res.json({groups: items})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}

export const getGroup: RequestHandler = async (req,res) => {
    const {id_event,id_group} = req.params
    //console.log(id_event)
    //console.log(id_group)
    const groupItem = await groups.getOne({
        id_event: parseInt(id_event),
        id: parseInt(id_group)
    })
    //console.log(groupItem)
    if(groupItem) return res.json({groups: groupItem})

    res.json({error: 'Ocorreu um erro ao pegar o grupo informado, verifique!!!'})
}

export const addGroup: RequestHandler = async (req,res) => {
    const {id_event} = req.params

    const addGroupSchema = z.object({
        name: z.string()
   })
   const body = addGroupSchema.safeParse(req.body)
   if(!body.success) return res.json({error: 'Dados inválidos, verifique!!!'})

   const newGroup = await groups.add({
    // ...body.data, //os 3 pontos significa que estou criando um clone(cópia) do que estiver no body da requisição
    name: body.data.name,
    id_event: parseInt(id_event)
   })

   if(newGroup) return res.status(201).json({groups: newGroup})

   res.json({error: 'Ocorreu um erro, verifique!!!'})
}

export const updateGroup: RequestHandler = async (req,res) => {
    const {id_event, id_group} = req.params

    const updateGroupSchema = z.object({
        name: z.string().optional()
    })

    const body = updateGroupSchema.safeParse(req.body)

    if(!body.success) return res.json({error: 'Dados inválidos, verifique!!!'})

    const updatedGroup = await groups.update({
        id_event: parseInt(id_event),
        id: parseInt(id_group)
    }, body.data)
    if(updatedGroup) return res.json({groups: updatedGroup})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}

export const deleteGroup: RequestHandler = async (req,res) => {
    const {id_event,id_group} = req.params

    const deletedGroup = await groups.remove({
        id_event: parseInt(id_event),
        id: parseInt(id_group)
    })

    if(deletedGroup) return res.json({groups: deletedGroup})

    res.json({error: 'Ocorreu um erro, verifique!!!'})
}