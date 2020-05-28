import express from 'express';

import Admin from '../services/admin';
import { errorCodesMap } from '../constants/error';

const { Router } = express;
const router = Router();

const admin = new Admin();

router.post('/assignQueue', async (req, res) => {
  try {
    await admin.assignQueue(req.body.agentId, req.body.queueId);
    return res.json({ ok: 'ok' });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

router.post('/unassignQueue', async (req, res) => {
  try {
    await admin.unassignQueue(req.body.agentId, req.body.queueId);
    return res.json({ ok: 'ok' });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

router.put('/agent', async (req, res) => {
  try {
    const id = await admin.addAgent(req.body);
    return res.json({ id });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

router.delete('/agent', async (req, res) => {
  try {
    await admin.removeAgent(req.query.id);
    return res.json({ ok: 'ok' });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

router.put('/queue', async (req, res) => {
  try {
    const id = await admin.addQueue(req.body);
    return res.json({ id });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

router.delete('/queue', async (req, res) => {
  try {
    await admin.removeQueue(req.query.id);
    return res.json({ ok: 'ok' });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    if (mappedError) {
      return res
        .status(mappedError.code)
        .json({ err: mappedError.message, reason: err.reason });
    }
    return res.status(500).json({ err: err.message, reason: err.reason });
  }
});

export default router;
