const PORT=8080;

const express=require('express');
const app = express();
const path=require('path');
const router = express.Router();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs').promises;

const faker=require('faker');

const normalizr=require('normalizr');
const normalize=normalizr.normalize;
const denormalize=normalizr.denormalize;
const schema=normalizr.schema;

/* import { normalize, schema } from "normalizr"; */
const util=require("util")

const {sqlite3Connect} = require('./DB/sqlite3.db')
const knex=require('knex')(sqlite3Connect)

let CHAT_DB = [];
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ----------------------- FAKER ----------------------- */

let productos = [ ];
let id=1

app.get('/api/productos-test', (req, res) => {
    const { cant } = req.query;

    if(!cant) {
        for (let i = 0; i < 10; i++){
            const producto = {
                nombre: faker.commerce.productName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl(),
                id: id++
            }
            productos.push(producto);
        }
        res.render('../views/products.ejs', {
            data: productos,
            title: `Listado de ${cant} productos`
        })
        /* res.json(productos); */
        productos=[]
        id=1
    }

    if(cant == 0){
        const noProd = "No hay productos";
        res.json(noProd);
    }

    if(cant >= 1){
        console.log(`Cantidad = ${cant}`);
        for(let i = 0; i < cant; i++){
        const producto = {
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            foto: faker.image.imageUrl()
        }
        productos.push(producto);  
        console.log(producto);
        }
        
        res.render('../views/products.ejs', {
            data: productos,
            title: `Listado de ${cant} productos`
        })
        /* res.json(productos); */
        productos=[]
    }
    
})

/* ----------------------- FAKER ----------------------- */


app.get("/", (req, res) => {
    res.render('../views/index.ejs', { 
        title: "Chat y Productos",
       });
});

//se declara y se inicializa la variable porcentaje que se vera en la pagina chat
let porcentaje = 0;

app.use('/chat', router);
app.get("/chat", (req, res) => {
    res.render('../views/layout.ejs', { 
        title: "Chat",
        porcentaje: porcentaje,
        message: CHAT_DB
       });
});

//Socket.io

io.on('connection', (socket) => {


    socket.on('cliente-mensaje', async (message) => {
        io.emit('server-mensaje', message)
        let messageFile = {
            /* id: socket.id, */
            email: message.email,
            nombre: message.nombre,
            edad: message.edad,
            timestamp: message.timestamp,
            mensaje: message.mensaje
        }
        CHAT_DB.push(messageFile)
        console.log("Mensajes totales ingresados al back")
        /* console.log(CHAT_DB) */
        const porc1=JSON.stringify(CHAT_DB).length
        console.log('longitud chat sin normalizar',porc1)

        try {
            knex('messages').insert(CHAT_DB)
            .then(()=> console.log("Mensajes de chat guardados en sqlite3"))
            .then(()=>fs.writeFile(`messages.txt`, JSON.stringify(CHAT_DB)) )
            .then(()=> console.log("Mensajes de chat guardados en archivo"))
            .catch((error)=> console.log(error))

            function print(objeto){
                console.log(util.inspect(objeto, false,15,true))
            }
            const user= new schema.Entity("user", {}, {idAttribute: 'email'})
            const chatSchema=new schema.Entity("author", {author: user}, {idAttribute: 'email'})
            

            const normalizedData=normalize(CHAT_DB, [chatSchema]);
            print(normalizedData);
            const porc2=JSON.stringify(normalizedData).length
            console.log('longitud chat normalizada: ',porc2)

            porcentaje= (porc2*100)/porc1
            console.log(`Porcentaje de compresión: ${porcentaje} %`)            
           
		} catch(err) {
			console.log('Error en la escritura del archivo', err.error)
		}
    })
})


app.use(express.static('public'))

app.get('*', (req, res) =>{
    res.render('../views/404.ejs', { 
        title: "Error!",
       });
});

const srv = server.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`)
})

srv.on("error", error => console.log(`Error en servidor ${error}`))
