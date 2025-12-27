const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

const rooms = {};

wss.on('connection', ws => {
  ws.on('message', data => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) { return; }
    const { type, room } = msg;

    if (!rooms[room]) rooms[room] = [];
    if (!rooms[room].includes(ws)) rooms[room].push(ws);

    const others = rooms[room].filter(client => client !== ws && client.readyState === WebSocket.OPEN);

    others.forEach(client => client.send(data));
  });

  ws.on('close', () => {
    Object.keys(rooms).forEach(room => {
      rooms[room] = rooms[room].filter(client => client !== ws);
      if (rooms[room].length === 0) delete rooms[room];
    });
  });
});

console.log('Signaling server çalışıyor');
