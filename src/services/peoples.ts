import { PrismaClient, Prisma } from "@prisma/client";

import * as groups from './groups'

const prisma = new PrismaClient()

type GetAllFilters = {id_event: number; id_group?: number}
export const getAll = async (filters: GetAllFilters) => {
    try {
        return await prisma.eventPeople.findMany({where: filters})
    } catch (error) {
        return false
    }
}

type GetOneFilters = {id_event: number; id_group?: number, id?: number; cpg?: string}
export const getOne = async (filters: GetOneFilters) => {
    try {

        //verifica se o id evento foi enviado ou(&&) o cpf, um ou outro tem que ter sido enviado
        if(!filters.id && !filters.cpg) return false

        return await prisma.eventPeople.findFirst({where: filters})
    } catch (error) {
        return false
    }
}

type PeopleCreateData = Prisma.Args<typeof prisma.eventPeople,'create'>['data']
export const add = async (data: PeopleCreateData) => {
    try {
        //console.log(data)
        //verifica se o grupo foi enviado na requisição
        if(!data.id_group) return false
        
        //verifica se o grupo existe no banco
        const group = await groups.getOne({
            id: data.id_group,
            id_event: data.id_event
        })

        //console.log(group)

        if(!group) return false

        return await prisma.eventPeople.create({data})

    } catch (error) {
        return false
    }
}

type PeolpeUpdateData = Prisma.Args<typeof prisma.eventPeople,'update'>['data']
type UpdateFilters = { id?: number; id_event: number; id_group?: number};
export const update = async (filters: UpdateFilters, data: PeolpeUpdateData) => {
    try {
        return await prisma.eventPeople.updateMany({where: filters, data})
    } catch (error) {
        return false
    }
}

type DeleteFilters = { id: number; id_event?: number; id_group?: number};
export const remove = async (filters: DeleteFilters) => {
    try {
      return await prisma.eventPeople.delete({where: filters})  
    } catch (error) {
        return false
    }
}