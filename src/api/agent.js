import express from 'express';

import Agent from '../services/agent';
import { errorCodesMap, MISSING_DATA } from '../constants/error';

const { Router } = express;
const router = Router();

const agent = new Agent();

// Agent context endpoints
router.get('/', async (req, res) => {
  const { agentId } = req.session;

  try {
    if (agentId) {
      const agentData = await agent.getAgent(agentId);
      return res.render('agent/queues', agentData);
    }

    return res.render('agent/login');
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.render('agent/fail', {
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const agentId = req.body.id;
    if (!agentId) {
      throw new Error(MISSING_DATA);
    }

    await agent.getAgent(agentId);
    req.session.agentId = agentId;

    return res.redirect('/agent');
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.render('agent/fail', {
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

router.get('/agentData', async (req, res) => {
  const { agentId } = req.session;
  if (!agentId) {
    return res.json({ agentData: {} });
  }

  try {
    const agentData = await agent.getAgent(agentId);
    return res.json({ agentData });
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.status(mappedError.status || 500).json({
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

router.post('/logout', (req, res) => {
  try {
    req.session.destroy();
    return res.redirect('/agent');
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.render('agent/fail', {
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

router.post('/addClientToQueue', async (req, res) => {
  try {
    await agent.addClientToQueue(req.body.queueId, req.body.clientId);
    return res.render('agent/success');
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.render('agent/fail', {
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

router.post('/removeClientFromQueue', async (req, res) => {
  try {
    await agent.removeClientFromQueue(req.body.queueId, req.body.clientId);
    return res.render('agent/success');
  } catch (err) {
    const mappedError = errorCodesMap[err.message];
    return res.render('agent/fail', {
      message: mappedError ? mappedError.message : err.message,
      reason: err.reason,
    });
  }
});

export default router;
