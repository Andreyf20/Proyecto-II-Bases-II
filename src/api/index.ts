import { env, send } from 'process';
import { Kafka } from 'kafkajs';
import { mysql } from 'mysql';
const express = require('express');
const mysql = require('mysql')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['25.108.214.3:9092']
})

const memsqldb = mysql.createConnection({
  host: '25.97.193.57',
  user: 'root',
  password: '',
  database: 'Precio_Viajes'
});

memsqldb.connect(function (err) {
  if (err) throw err;
  console.log("MemSQL Connected!");
});


let router = express.Router();

router.get('/', async (req, res) => {
  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'busquedas',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  await producer.disconnect()
  res.send('DONE')
});

router.get('/buscar/:origen/:destino/:fecha', async(req, res) => {
  const origen = req.params.origen;
  const destino = req.params.destino;
  const fecha = req.params.fecha;

  console.log(origen, destino, fecha)

  if(!destino || !origen || !fecha) res.status(400).send({error : 'Debe especificar todos los parametros'})

  // Send the data to hive through kafka to process the price
  // TODO: n

  // Send the request to get the price in memsql
  executeSearchQuery(req, res, origen, destino, fecha)
})

function executeSearchQuery(req, res, origen, destino, fecha) {
    const sql_statement = `select precio from precios where origen = '${origen}' and destino = '${destino}' and DATEDIFF(fecha, '${fecha}') = 0 order by id desc limit 1`;

    memsqldb.query(sql_statement, (err, result) => {
      if (err) {
        console.log(err)
        res.status(400).send({error : 'Ocurrió un error con la consulta'});
      }
      console.log("RESPUESTA: ", result);
  
      if(result.length < 1){
        // Keep asking memsql for the price until it gets a response from hive
        executeSearchQuery(req, res, origen, destino, fecha)
      }else
        res.status(200).send({"precio" : result[0].precio}) 
    });
}

router.get('/consume', async (req, res) => {
  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'busquedas', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
  res.send('DONE')
});

export = router;