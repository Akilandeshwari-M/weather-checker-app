const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City name is required' });

    try {
        // Dynamic import for node-fetch compatibility across all Node versions
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => globalThis.fetch(...args));

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        res.json({
            city: name,
            country: country || '',
            lat: latitude,
            lon: longitude,
            current: weatherData.current,
            daily: weatherData.daily
        });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: 'Failed to fetch weather data from API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
