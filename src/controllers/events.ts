import { RequestHandler } from "express";
import * as events from '../services/events'
import * as peoples from '../services/peoples'
import { string, z } from "zod";
import { strict } from "assert";

export const getAll: RequestHandler = async (req,res) => {
    const items = await events.getAll()
    if(items) return res.json({events: items})

    res.json({error: 'Ocorreu um erro na consulta, verifique!!!'})
}

export const getEvent: RequestHandler = async (req,res) => {
    const { id } = req.params

    //consulta no services e verifica se existe o evento informado, dai retonar o mesmo ou diz que não existe
    const eventItem = await events.getOne(parseInt(id))
    if(eventItem) return res.json({event: eventItem})

    res.json({error: 'Ocorreu um erro na consulta, verifique!!!'})

}

export const addEvent: RequestHandler = async (req,res) => {
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    })
    const body = addEventSchema.safeParse(req.body)

    if(!body.success) return res.json({error: 'Dados inválidos, verifique!!!'})

    const newEvent = await events.add(body.data)
    if(newEvent) return res.status(201).json({event: newEvent})

    res.json({error: 'Ocorreu um erro na consulta, verifique!!!'})
}

export const updateEvent: RequestHandler = async (req,res) => {
    const {id} = req.params
    const updateEventSchema= z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    })
    const body = updateEventSchema.safeParse(req.body)
    if(!body.success) return res.json({error: 'Dados inválidos, verifique!!!'})
    
    const updatedEvent = await events.update(parseInt(id), body.data)
    if(updatedEvent) {

        //se status = true, fazer o sorteio das pessoas, caso false, limpar o sorteio
        if(updatedEvent.status) {
            // fazer o sorteio
            const result = await events.doMatches(parseInt(id))
            if(!result) {
                return res.json({error: 'Grupo impossível de fazer o sorteio, verifique!!!'})
            }
        }else{
            // limpa a lista de sorteio
            await peoples.update({id_event: parseInt(id)},{matched: ''})
        }

        return res.json({event: updatedEvent})
    }

    res.json({error: 'Dados inválidos, verifique!!!'})
}

export const deleteEvent: RequestHandler = async (req,res) => {
    const {id} = req.params
    const deletedEvent = await events.remove(parseInt(id))

    if(deletedEvent) return res.json({event: deletedEvent})

    res.json({error: 'Dados inválidos, verifique!!!'})
}
