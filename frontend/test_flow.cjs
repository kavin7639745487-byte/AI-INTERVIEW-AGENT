const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/interview',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const sendRequest = (body) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
};

const run = async () => {
  const sessionId = 'test-flow-' + Date.now();
  console.log('1. Starting Interview...');
  
  // Initialize with empty candidate for simulation (backend allows it, or we can mock one)
  let res = await sendRequest({
    sessionId,
    candidate: { member: { name: "Integration Tester" }, missions: [{"day":1, "title": "React"}] },
    message: null
  });
  
  console.log('Start Response:', res.reply.substring(0, 50) + '...', 'Done:', res.done);
  
  let turns = 0;
  while (!res.done && turns < 15) {
    turns++;
    console.log(`\nTurn ${turns}: Sending Answer...`);
    res = await sendRequest({
      sessionId,
      message: "Here is my detailed answer about " + turns
    });
    console.log('Response:', res.reply ? res.reply.substring(0, 50) + '...' : 'None', 'Done:', res.done);
  }
  
  if (res.done) {
    console.log('\nInterview Complete!');
    console.log('Feedback Summary:', res.feedback?.summary);
    console.log('Feedback Strengths:', res.feedback?.strengths?.length);
  }
};

run().catch(console.error);
