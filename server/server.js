const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});

app.get('/calibration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'calibration.html'));

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
}); 