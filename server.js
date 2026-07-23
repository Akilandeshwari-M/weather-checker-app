const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Serve static files from both the root directory AND public directory (covers both cases)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// DIRECT HOME ROUTE: Sends index.html whenever anyone opens your site
app.get('/', (req, res) => {
    // Tries public/index.html first, falls back to root index.html
    const publicPath = path.join(__dirname, 'public', 'index.html');
    const rootPath = path.join(__dirname, 'index.html');

    res.sendFile(publicPath, (err) => {
        if (err) {
            res.sendFile(rootPath);
        }
    });
});

// Weather API Endpoint
app.get('/weather', (req, res) => {
    const city = req.query.city ? req.query.city.toLowerCase() : '';

    if (city === 'london' || city === 'hosur') {
        res.json({ raining: false, message: 'clear, sunny skies' });
    } else if (city === 'mumbai' || city === 'new york') {
        res.json({ raining: true, message: 'moderate to heavy rain showers' });
    } else {
        res.json({ raining: false, message: 'partly cloudy but dry' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
