const express = require('express');
const path = require('path');
const cors = require('cors'); // 👈 ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 5000; // 👈 Updated to work with cloud hosts

app.use(cors()); // 👈 ADD THIS LINE

// 1. Serve your static files (index.html, file.css) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Weather Endpoint (Handles the API requests from your frontend)
app.get('/weather', (req, res) => {
    const city = req.query.city ? req.query.city.toLowerCase() : '';

    // Simple custom weather data logic
    if (city === 'london' || city === 'hosur') {
        res.json({ raining: false, message: 'clear, sunny skies' });
    } else if (city === 'mumbai' || city === 'new york') {
        res.json({ raining: true, message: 'moderate to heavy rain showers' });
    } else {
        res.json({ raining: false, message: 'partly cloudy but dry' });
    }
});

// 3. Start the server engine
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
