const net = require('net');

function testPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);
    socket.on('connect', () => {
      console.log(`Port ${port} is OPEN`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      console.log(`Port ${port} TIMED OUT`);
      socket.destroy();
      resolve(false);
    });
    socket.on('error', (err) => {
      console.log(`Port ${port} ERROR:`, err.message);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, 'aws-0-ap-northeast-2.pooler.supabase.com');
  });
}

async function main() {
  await testPort(5432);
  await testPort(6543);
}

main();
