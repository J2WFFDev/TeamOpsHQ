const http = require('http');
http.get('http://localhost:3000/events', (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.slice(0, 1000)));
}).on('error', err => console.error('ERR', err.message));
