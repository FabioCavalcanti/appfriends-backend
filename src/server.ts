import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import https from 'https' //usando a porta 443
import http from 'http' //usando a porta 80
import fs from 'fs'
import siteRoutes from './routes/site'
import adminRoutes from './routes/admin'
import { requestIntercepte } from './utils/requestIntercepte'
import { fileURLToPath } from 'url'

const app = express()

// usando o cors para iniciar o server
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//exibe o formato e os dados que foram solicitado ao servidor, na hora de desenvolvimento
//muito bom para saber o que se parseArgs, se os a solicitação está sendo feita corretamente
app.all('*', requestIntercepte)

app.use('/admin', adminRoutes)
app.use('/',siteRoutes)

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`Rodando na Porta ${port}`)
    })
}

// servidor de produção/desenvolvimento (production/development)
const regularServer = http.createServer(app)
if(process.env.NODE_ENV === 'production'){
    // TODO: configurar SSL
    // TODO: rodar serve na port 80 (http) e na porta 443 (https)
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string)
    }
    //criar o servidor HHTPS
    const secServer = https.createServer(options,app)
    runServer(80,regularServer)
    runServer(443,secServer)
} else {
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000
    runServer(serverPort,regularServer) 
}