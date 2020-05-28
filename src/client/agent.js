import axios from 'axios';

setInterval(async () => {
  const {
    data: { agentData },
  } = await axios.get('/agent/agentData');
  const queues = agentData && agentData.queues;
  if (queues) {
    queues.forEach((queue) => {
      const fieldName = `queue-length-${queue.id}`;
      const field = document.getElementById(fieldName);
      if (field) {
        field.innerText = queue.members.length;
      }
    });
  }
}, 2000);
