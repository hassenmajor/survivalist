/*
    Starting point for the app
*/

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));

const html = require('http');
const fs = require('fs');

const port = process.env.PORT || 3000;
const server = html.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./dist/index.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
});

server.listen(port, (error) => {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});
