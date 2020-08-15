import { env } from 'process';
import { Kafka } from 'kafkajs';
import { mysql } from 'mysql';
const express = require('express');
const mysql = require('mysql')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['25.108.214.3:9092']
})

const memsqldb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Precio_Viajes'
});

memsqldb.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
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

router.get('/precio', async (req, res) => {
  var sql = 'SELECT * FROM precios ORDER BY origen';

  memsqldb.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result || !result.length) {
      console.log("No results")
      return;
    }
    console.log(result);
  });
});





export = router;