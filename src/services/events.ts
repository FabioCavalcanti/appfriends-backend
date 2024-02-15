import { PrismaClient, Prisma } from "@prisma/client"
import { promises } from "dns"
import { type } from "os"

import * as peoples from './peoples'
import * as groups from './groups'
import { number } from "zod"
import { encryptMatch } from "../utils/match"

const prisma = new PrismaClient()

export const getAll = async () => {
    try {
        return await prisma.event.findMany()
    } catch (error) {
        return false
    }
}

export const getOne = async (id: number) => {
    try {
        console.log(id)
        return await prisma.event.findFirst({ where: {id} })
    } catch (error) {
        return false
    }
}

// este type pega no prisma os meus dados obrigatorios no create
type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data']
export const add = async (data: EventsCreateData) => {
    try {
        return await prisma.event.create({data})
    } catch (error) {
        return false
    }
}

type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data']
export const update = async (id: number, data: EventsUpdateData) => {
    try {
        return await prisma.event.update({where: {id}, data})
    } catch (error) {
        return false
    }
}

export const remove = async (id: number) => {
    try {
        return await prisma.event.delete({ where: {id} })
    } catch (error) {
        return false
    }
}

//fazer o sorteio das pessoas e colocar no matche
/*
ID do Evento: 1
- Grupo A ID:1
-- Fábio Cavalcanti
-- Rita
-- Carol

ID do Evento: 2
- Grupo B ID:2
-- Celso
-- Rubens

Id do evento: 3
- Grupo C ID: 3
-- Priscilla
*/
export const doMatches = async (id:number): Promise<boolean> => {
    // verifica se o Evento existe e pega pelo ID e somente o campo grouped
    const eventItem = await prisma.event.findFirst({ where: {id},select: {grouped:true}})
    console.log(eventItem)
    if(eventItem) {
      const peopleList = await peoples.getAll({id_event: id})
      console.log(peopleList)
      if(peopleList){
        // const -> a variável não pode ser mudada, no caso do, let ela pode ser alterada.
        let sortedList: {id: number, match: number}[] = []
        // guardar as pessoas que podem ser sorteadas
        let sortable: number[] = []

        let attempts = 0
        let maxAttempts = peopleList.length
        let keepTrying = true
        while (keepTrying && attempts < maxAttempts) {
            keepTrying = false
            attempts++
            sortedList=[] //limpa a lista
            sortable = peopleList.map(item => item.id)

            for(let i in peopleList){
                let sortableFiltered: number[] = sortable
                //verifica se o evento é agrupado, se for tem que pegar pessoas que não fazem parte do meu evento
                if(eventItem.grouped){
                    sortableFiltered = sortable.filter(sortableItem => {
                        let sortablePerson = peopleList.find(item => item.id === sortableItem)
                        return peopleList[i].id_group !== sortablePerson?.id_group
                    })
                }

                //verifica se na lista ainda existe uma só pessoa restando e se está pessoa sou EU
                if(sortableFiltered.length === 0 || (sortableFiltered.length === 1 && peopleList[i].id === sortableFiltered[0])){
                   keepTrying = true
                }else{
                    //criar um indice aletorio para varrer toda lista d sorteaveis
                    let sortedIndex = Math.floor(Math.random() * sortableFiltered.length)
                    //verifica se eu estou tirando eu mesmo, sai até que seja uma outra pessoa que tirei
                    while(sortableFiltered[sortedIndex] === peopleList[i].id){
                        sortedIndex = Math.floor(Math.random() * sortableFiltered.length)
                    }

                    //se tirei uma pessoa que não seja eu salvo
                    sortedList.push({
                        id: peopleList[i].id,
                        match: sortableFiltered[sortedIndex]
                    })
                    // agora retira da lista a pessoa que já foi sorteada da lista de sorteaveis
                    // ex: se em uma lista de [1,2,3,4] e foi sorteado o 3, a nova lista passa a ser
                    // [1,2,4] sem o 3 que já foi sorteado
                    sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex])
                }
            }
        }
        /*
        console.log(`ATTEMPS: ${attempts}`)
        console.log(`MAX ATTEMPS: ${maxAttempts}`)
        console.log(sortedList)   
        */
        if(attempts < maxAttempts){
            for (let i in sortedList) {
                await peoples.update({
                    id: sortedList[i].id,
                    id_event: id
                },{matched: encryptMatch(sortedList[i].match)})                
            }
            return true
        }
 
      }  

    }

    return false
}