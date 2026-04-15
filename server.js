const express = require('express');
const cors = require('cors');
const StudentVue = require('studentvue');
const app = express();

// 1. Explicit CORS configuration
const corsOptions = {
    origin: 'https://github.io', // Your frontend URL
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. Explicitly handle the OPTIONS pre-flight for the /login route
app.options('/login', cors(corsOptions));

// 3. Health check route
app.get('/', (req, res) => {
    res.send('Grade Melon Backend is Live!');
});

// 4. Hardened Login Route
app.post('/login', async (req, res) => {
    const { url, username, password } = req.body;
    console.log(`POST attempt for: ${username}`);
    
    try {
        const client = await StudentVue.login(url, { 
            username, 
            password, 
            appVersion: "5.3.0" 
        });
        
        const studentInfo = await client.studentInfo();
        res.json({ success: true, client: { studentInfo } });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
