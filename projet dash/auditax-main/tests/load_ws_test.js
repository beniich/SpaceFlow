import ws from 'k6/ws';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const wsLatency = new Trend('ws_latency');

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp up to 50 concurrent users
    { duration: '20s', target: 50 },  // Hold at 50 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
};

export default function () {
  const url = `ws://localhost:3000/ws`;

  const params = { tags: { my_tag: 'auditax-staging' } };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      // simulate connection established
    });

    socket.on('message', (msg) => {
      const data = JSON.parse(msg);
      
      // Measure reaction time
      if(data.type === 'WELCOME') {
        check(data, { 'welcome received': (d) => d.message === 'AuditAX Live Stream Active' });
      }
    });

    socket.on('error', (e) => {
      if (e.error() != 'websocket: close sent') {
        console.log('An unexpected error occurred: ', e.error());
      }
    });

    socket.setTimeout(function () {
      socket.close();
    }, 15000); // close after 15s to simulate ephemeral client
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
