const http = require('http');

const testUrl = (url) => {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
};

async function run() {
  console.log("Testing invalid URL /invalid-slug-without-in...");
  const res = await testUrl('http://localhost:3000/invalid-slug-without-in');
  if (res.error) {
    console.log("Error:", res.error);
  } else {
    console.log("Status Code:", res.statusCode);
  }
}

run();
