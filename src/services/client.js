import mongoose from 'mongoose';

import { VALIDATION_ERROR } from '../constants/error';
import { addToQueue, getQueues } from '../models/queue';

export default class Client {
  async addToQueue(queueId) {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(queueId);

    if (!isValidObjectId) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = `Queue ID is not a valid ID: ${queueId}`;
      throw error;
    }

    const queue = await addToQueue(queueId);
    const clientQueueData = this.mapQueueData(queue);
    return {
      ...clientQueueData,
      clientId: queue.members[queue.members.length - 1],
    };
  }

  async getQueues() {
    const queues = await getQueues();
    return queues.map((queue) => this.mapQueueData(queue));
  }

  mapQueueData(queue) {
    return {
      name: queue.name,
      id: queue._id,
      length: queue.members.length,
    };
  }
}
