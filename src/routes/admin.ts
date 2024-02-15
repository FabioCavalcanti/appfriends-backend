import { Router } from "express";
import * as auth from '../controllers/auth'
import * as events from '../controllers/events'
import * as groups from '../controllers/groups'
import * as peoples from '../controllers/peoples'

const router = Router()

router.post('/login',auth.login)

router.get('/ping',auth.validate, (req,res) => res.json({pong: true, admin: true}))

//regra para os eventos - CRUD
router.get('/events',auth.validate, events.getAll)  //lista todos 
router.get('/events/:id',auth.validate,events.getEvent) // lista um evento apenas
router.post('/events',auth.validate, events.addEvent) // adiciona um evento
router.put('/events/:id',auth.validate,events.updateEvent) // atualiza um evento
router.delete('/events/:id',auth.validate, events.deleteEvent) // exclui um evento

//regra para os grupos - CRUD
router.get('/events/:id_event/groups', auth.validate,groups.getAll)
router.get('/events/:id_event/groups/:id_group', auth.validate, groups.getGroup)
router.post('/events/:id_event/groups', auth.validate,groups.addGroup)
router.put('/events/:id_event/groups/:id_group',auth.validate,groups.updateGroup)
router.delete('/events/:id_event/groups/:id_group', auth.validate,groups.deleteGroup)

//regra para as pessoas dos eventos - CRUD
router.get('/events/:id_event/groups/:id_group/peoples', auth.validate,peoples.getAll)
router.get('/events/:id_event/groups/:id_group/peoples/:id_people', auth.validate,peoples.getPerson)
router.post('/events/:id_event/groups/:id_group/peoples', auth.validate,peoples.addPerson)
router.put('/events/:id_event/groups/:id_group/peoples/:id_people', auth.validate,peoples.updatePerson)
router.delete('/events/:id_event/groups/:id_group/peoples/:id_people', auth.validate,peoples.deletePerson)

export default router