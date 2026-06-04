'use strict';

const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Hello from the Dev pipeline demo!',
      hostname: require('os').hostname(),
      time: new Date().toISOString(),
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
