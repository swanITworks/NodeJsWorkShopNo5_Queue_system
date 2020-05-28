import mongoose from 'mongoose';
import MongoClient from 'mongodb';

import { Agent } from './agent';

const { ObjectID } = MongoClient;

export const queueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.ObjectId],
    required: true,
  },
  agents: {
    type: [mongoose.Schema.ObjectId],
    ref: Agent,
  },
});

export const Queue = mongoose.model('Queue', queueSchema);

export const addQueue = async (queueData) => {
  const queue = new Queue(queueData);
  await queue.save();
  return queue._id;
};

export const getQueue = (queueId) => Queue.findOne({ _id: queueId }).exec();

export const removeQueue = async (queueId) => {
  const result = await Queue.deleteOne({
    _id: queueId,
  }).exec();

  return result.deletedCount;
};

export const getQueues = (agentId) => {
  const query = {};

  if (agentId) {
    query.agents = { $in: [agentId] };
  }

  return Queue.find(query).lean().exec();
};

export const assignToQueue = (queueId, agentId) =>
  Queue.updateOne({ _id: queueId }, { $addToSet: { agents: agentId } }).exec();

export const unassignFromQueue = (queueId, agentId) =>
  Queue.updateOne({ _id: queueId }, { $pull: { agents: agentId } }).exec();

export const addToQueue = async (queueId, userId) => {
  const newId = userId || new ObjectID();
  const queue = await Queue.findOneAndUpdate(
    { _id: queueId },
    { $addToSet: { members: newId } }
  ).exec();

  return {
    ...queue.toObject(),
    members: [...queue.members, newId],
  };
};

export const removeFromQueue = (queueId, userId) =>
  Queue.updateOne({ _id: queueId }, { $pull: { members: userId } }).exec();
