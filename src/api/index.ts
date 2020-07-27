import { env } from 'process';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['25.108.214.3:9092']
})

const express = require('express');
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
export = router;