const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    if (req.headers.host.startsWith('www.')) {
        const newHost = req.headers.host.slice(4);
        return res.redirect(301, `https://${newHost}${req.originalUrl}`);
    }
    next();
});

// Serve only the static files from the dist directory
app.use(express.static(path.join(__dirname, '/dist/aurore-salavert_front-end')));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/dist/aurore-salavert_front-end/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
