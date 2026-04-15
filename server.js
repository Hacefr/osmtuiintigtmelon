const express = require('express');
const cors = require('cors');
const StudentVue = require('studentvue');
const app = express();

// 1. Better CORS handling
// Allows your GitHub Pages site to communicate with this server
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. Simple root route for health checks
app.get('/', (req, res) => {
    res.send('Grade Melon Backend is Live!');
});

// 3. The Login Route
// We use an array for the path to handle both /login and /login/ 
// this fixes the 405 Method Not Allowed error caused by trailing slash redirects
app.post(['/login', '/login/'], async (req, res) => {
    const { url, username, password } = req.body;
    console.log(`Login attempt for: ${username} at ${url}`);
    
    try {
        const client = await StudentVue.login(url, { 
            username, 
            password, 
            appVersion: "5.3.0" 
        });
        
        // Fetch student info immediately so we can send it to the frontend
        const studentInfo = await client.studentInfo();
        
        // Send back a success response with the student data
        res.json({ 
            success: true, 
            client: { studentInfo } 
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
});

// 4. Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
});
