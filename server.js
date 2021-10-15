const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msj: 'Welcome to the airport API' }));

// Define Routes
app.use('/api/weather', require('./routes/weather'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/airports', require('./routes/airports'));
app.use('/api/flights', require('./routes/flights'));

// Insert mock data
app.use('/api/mock', require('./routes/mock'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
