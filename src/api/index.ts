import { env } from 'process';

const express = require('express');
let router = express.Router();

router.get('/', async (req, res) => {
  res.send("XD")
});

export = router;
