import { Router } from "express";
import * as events from '../controllers/events' 
import * as people from '../controllers/peoples'

const router = Router()
//testar se a rota está funcionando
//router.get('/ping', (req,res) => res.json({pong: true}))

//Rotas do Frontend do App
router.get('/events/:id', events.getEvent)
router.get('/events/:id_event/search', people.searchPerson)

export default router