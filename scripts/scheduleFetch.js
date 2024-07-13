// scripts/scheduleFetch.js
const cron = require('node-cron');
const axios = require('axios');

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/fetchImages?folder=your_folder_name');
    console.log('Task executed successfully:', response.data);
  } catch (error) {
    console.error('Error executing scheduled task:', error);
  }
});

console.log('Cron job scheduled to run every day at midnight');
