import mongoose from 'mongoose';

export const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

export const Agent = mongoose.model('Agent', agentSchema);

export const addAgent = async (agentData) => {
  const agent = new Agent(agentData);
  await agent.save();
  return agent._id;
};

export const getAgent = (agentId) =>
  Agent.findOne({ _id: agentId }).lean().exec();

export const removeAgent = async (agentId) => {
  const result = await Agent.deleteOne({
    _id: agentId,
  }).exec();

  return result.deletedCount;
};
