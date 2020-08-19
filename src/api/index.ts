import { env, send } from 'process';
import { Kafka } from 'kafkajs';
import { mysql } from 'mysql';
const express = require('express');
const mysql = require('mysql')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['25.92.183.245:9092']
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


router.get('/buscar/:origen/:destino/:fecha', async(req, res) => {
  const origen = req.params.origen;
  const destino = req.params.destino;
  const fecha = req.params.fecha;

  console.log(origen, destino, fecha)

  if(!destino || !origen || !fecha) res.status(400).send({error : 'Debe especificar todos los parametros'})

  // Send the data to hive through kafka to process the price
  // TODO: n
  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'kafkapython',
    messages: [
      { value: `insert into busquedas(origen, destino, fecha) values("${origen}", "${destino}", "${fecha}")`},
    ],
  })

  await producer.disconnect()

  // Send the request to get the price in memsql
  const sql_statement = `select precio from precios where origen = '${origen}' and destino = '${destino}' and DATEDIFF(fecha, '${fecha}') = 0 order by id desc limit 1`;
  executeSearchQuery(req, res, origen, destino, fecha, true)
})

function executeSearchQuery(req, res, origen, destino, fecha, datediff) {
  var sql_statement:string;
  if(datediff)
    sql_statement = `select precio from precios where origen = '${origen}' and destino = '${destino}' and DATEDIFF(fecha, '${fecha}') = 0 order by id desc limit 1`;
  else
    sql_statement = `select precio from precios where origen = '${origen}' and destino = '${destino}' order by id desc limit 1`;

    memsqldb.query(sql_statement, (err, result) => {
      if (err) {
        console.log(err)
        res.status(400).send({error : 'Ocurrió un error con la consulta'});
      }
      console.log("RESPUESTA: ", result);
  
      if(result.length < 1){
        // Keep asking memsql for the price until it gets a response from hive
        executeSearchQuery(req, res, origen, destino, fecha, false)
      }else
        res.status(200).send({"precio" : result[0].precio}) 
    });
}


export = router;