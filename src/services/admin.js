import mongoose from 'mongoose';

import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import {
  addQueue,
  assignToQueue,
  getQueue,
  removeQueue,
  unassignFromQueue,
} from '../models/queue';
import { addAgent, getAgent, removeAgent } from '../models/agent';

export default class Admin {
  async assignQueue(agentId, queueId) {
    const agentData = await this.getAgent(agentId);
    const queueData = await this.getQueue(queueId);

    await assignToQueue(queueData._id, agentData._id);
    return true;
  }

  async unassignQueue(agentId, queueId) {
    const agentData = await this.getAgent(agentId);
    const queueData = await this.getQueue(queueId);

    await unassignFromQueue(queueData._id, agentData._id);
    return true;
  }

  async addAgent(agentData) {
    if (!agentData) {
      throw new Error(MISSING_DATA);
    }

    try {
      return await addAgent(agentData);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error(VALIDATION_ERROR);
        error.reason = err.message;
        throw error;
      }

      throw err;
    }
  }

  async removeAgent(agentId) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(agentId);

    if (!isValidObjectId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Not a valid ID: ${agentId}`;
      throw error;
    }

    const deletedCount = await removeAgent(agentId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  async addQueue(queueData) {
    if (!queueData) {
      throw new Error(MISSING_DATA);
    }

    try {
      return await addQueue(queueData);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error(VALIDATION_ERROR);
        error.reason = err.message;
        throw error;
      }

      throw err;
    }
  }

  async removeQueue(queueId) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(queueId);
    if (!isValidObjectId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Queue ID is not a valid ID: ${queueId}`;
      throw error;
    }

    // Remove here
    const deletedCount = await removeQueue(queueId);
    if (deletedCount === 0) {
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

    // Return agent here
    const agentData = await getAgent(agentId);

    if (!agentData) {
      const error = new Error(NOT_FOUND);
      error.reason = `Agent not found!`;
      throw error;
    }

    return agentData;
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
}
