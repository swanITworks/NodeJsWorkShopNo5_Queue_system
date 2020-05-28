import axios from 'axios';

setInterval(async () => {
  const {
    data: { queues },
  } = await axios.get('/client/queues');
  queues.forEach((queue) => {
    const fieldName = `queue-length-${queue.id}`;
    const field = document.getElementById(fieldName);
    if (field) {
      field.innerText = queue.length;
    }
  });
}, 5000);
