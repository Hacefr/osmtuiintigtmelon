const express = require('express');
const cors = require('cors');
const StudentVue = require('studentvue');
const app = express();

// 1. Expanded CORS handling to specifically allow the headers you're sending
app.use(cors({
    origin: '*', // For testing; you can restrict this to your github.io URL later
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. Add a simple root route
app.get('/', (req, res) => {
    res.send('Grade Melon Backend is Live!');
});

// 3. The Login Route
// We use app.all here to ensure we can catch and debug exactly what's happening
app.post('/login', async (req, res) => {
    const { url, username, password } = req.body;
    console.log(`Login attempt for: ${username} at ${url}`);
    
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

// Explicitly handle the /login path with a trailing slash just in case Render redirects
app.post('/login/', (req, res) => {
    res.redirect(307, '/login'); 
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
