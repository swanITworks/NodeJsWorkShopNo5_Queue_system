import express from 'express';

import { errorCodesMap } from '../constants/error';
import Client from '../services/client';

const { Router } = express;
const router = Router();

const client = new Client();

router.get('/', async (req, res) => {
  try {
    const queues = await client.getQueues();
    return res.render('client/queues', { queues });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

router.get('/queues', async (req, res) => {
  try {
    const queues = await client.getQueues();
    return res.json({ queues });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

router.post('/addToQueue', async (req, res) => {
  try {
    const queue = await client.addToQueue(req.body.id);
    return res.render('client/success', {
      name: queue.name,
      size: queue.length - 1,
      id: queue.clientId,
    });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res.render('client/fail', {
        message: mappedError.message,
        reason: err.reason,
      });
    }
    return res.render('client/fail', {
      message: err.message,
      reason: err.reason,
    });
  }
});

export default router;
