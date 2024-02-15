import { PrismaClient, Prisma } from "@prisma/client";

import * as events from './events'

const prisma = new PrismaClient()

export const getAll = async (id_event: number) => {
    try {
        return await prisma.eventGroup.findMany({where: {id_event}})
    } catch (error) {
        return false
    }
}

type GetOneFilters = {id_event?: number; id: number;} //colocando uma ? no parammetro,indica que é opcional
export const getOne = async (filters: GetOneFilters) => {
    //console.log(filters)
    try {
        //console.log(filters)
        return await prisma.eventGroup.findFirst({where: filters})
    } catch (error) {
        //console.log(filters)
        return false
    }
}

type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data']
export const add = async (data: GroupsCreateData) => {
    try {
        if(!data.id_event) return false

        //verifica se o evento existe no banco de dados
        const eventItem = await events.getOne(data.id_event)
        if(!eventItem) return false

        return await prisma.eventGroup.create({data})

    } catch (error) {
        return false
    }
}

type UpdateFilters = {id_event?: number; id: number;}
type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data']
export const update = async (filters: UpdateFilters, data: GroupsUpdateData) => {
    try {
        return await prisma.eventGroup.update({where: filters,data})
    } catch (error) {
        return false
    }
}

type DeleteFilters = {id_event?: number, id: number}
export const remove = async (filters: DeleteFilters) => {
    try {
      return await prisma.eventGroup.delete({where: filters})  
    } catch (error) {
        return false
    }
}