const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    next();
});

app.use(express.static(path.join(__dirname, '/dist/aurore-salavert_front-end')));

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/aurore-salavert_front-end/robots.txt'));
});

app.get('/*', function(req, res) {
    const isKnownPage = req.path === '/' || /^\/privacy-policy\/?$/.test(req.path) || /^\/project\/[^/]+\/?$/.test(req.path);
    res.status(isKnownPage ? 200 : 404).sendFile(path.join(__dirname, '/dist/aurore-salavert_front-end/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
