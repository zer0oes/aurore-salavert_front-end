const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    if (req.headers.host === 'aurore-salavert.fr') {
        return res.redirect(301, `https://www.aurore-salavert.fr${req.originalUrl}`);
    }
    next();
});

app.use(express.static(path.join(__dirname, '/dist/aurore-salavert_front-end')));

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/aurore-salavert_front-end/robots.txt'));
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/dist/aurore-salavert_front-end/index.html'));
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});