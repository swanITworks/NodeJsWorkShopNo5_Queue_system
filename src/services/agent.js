import mongoose from 'mongoose';

import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import {
  addToQueue,
  getQueue,
  getQueues,
  removeFromQueue,
} from '../models/queue';
import { getAgent } from '../models/agent';

export default class Agent {
  async addClientToQueue(queueId, clientId) {
    const isValidClientId = mongoose.Types.ObjectId.isValid(clientId);
    if (!isValidClientId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Client ID is not valid ObjectID: ${clientId}`;
      throw error;
    }

    const queueData = await this.getQueue(queueId);
    await addToQueue(queueData._id, clientId);
    return true;
  }

  async removeClientFromQueue(queueId, clientId) {
    const isValidClientId = mongoose.Types.ObjectId.isValid(clientId);
    if (!isValidClientId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Client ID is not valid ObjectID: ${clientId}`;
      throw error;
    }

    const queueData = await this.getQueue(queueId);
    const result = await removeFromQueue(queueData._id, clientId);
    if (result.nModified === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  async getAgent(agentId) {
    const isValidAgentId = mongoose.Types.ObjectId.isValid(agentId);
    if (!isValidAgentId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Agent ID is not valid ObjectID: ${agentId}`;
      throw error;
    }

    const agent = await getAgent(agentId);
    if (!agent) {
      throw new Error(NOT_FOUND);
    }

    const queues = await getQueues(agentId);
    return {
      ...agent,
      queues: queues.map(this.transformQueue),
    };
  }

  async getQueue(queueId) {
    if (!queueId) {
      throw new Error(MISSING_DATA);
    }

    const isValidAgentId = mongoose.Types.ObjectId.isValid(queueId);
    if (!isValidAgentId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Queue ID is not valid ObjectID: ${queueId}`;
      throw error;
    }

    // Return agent here
    const queueData = await getQueue(queueId);

    if (!queueData) {
      const error = new Error(NOT_FOUND);
      error.reason = `Queue not found!`;
      throw error;
    }

    return queueData;
  }

  transformQueue(queue) {
    return {
      ...queue,
      id: queue._id,
    };
  }
}
