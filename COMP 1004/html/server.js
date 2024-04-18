const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Serve index.html file
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Handle signup request
    else if (req.url === '/signup' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const userData = JSON.parse(body);
            // Save user data to users.json
            fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
                if (err && err.code !== 'ENOENT') {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                const users = JSON.parse(data || '[]');
                users.push(userData);
                fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users), 'utf8', err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Signup successful' }));
                });
            });
        });
    }
    // Serve users.json file
    else if (req.url === '/users.json') {
        fs.readFile(path.join(__dirname, 'users.json'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    // Handle other requests (e.g., CSS, images)
    else {
        // You can add code here to handle other types of files
    }
});

const PORT = process.env.PORT || 8080;
const HOST = '127.0.0.1';
server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
