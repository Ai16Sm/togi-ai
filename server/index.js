require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { handleAIResponse } = require('./ai/togiPersonality');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await handleAIResponse(message);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process request'
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 