const express = require('express');
const cors = require('cors');
const StudentVue = require('studentvue');
const app = express();

// 1. Better CORS handling
app.use(cors()); 
app.use(express.json());

// 2. Add a simple root route so the main URL isn't a 404
app.get('/', (req, res) => {
    res.send('Grade Melon Backend is Live!');
});

// 3. The Login Route
app.post('/login', async (req, res) => {
    const { url, username, password } = req.body;
    console.log(`Login attempt for: ${username} at ${url}`);
    
    try {
        const client = await StudentVue.login(url, { 
            username, 
            password, 
            appVersion: "5.3.0" 
        });
        // We only send back the necessary data
        res.json({ success: true, client: { studentInfo: await client.studentInfo() } });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
