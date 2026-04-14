const express = require('express');
const cors = require('cors');
const StudentVue = require('studentvue');
const app = express();

app.use(cors({ origin: 'https://github.io' })); // Allows your GitHub site
app.use(express.json());

app.post('/login', async (req, res) => {
    const { url, username, password } = req.body;
    try {
        const client = await StudentVue.login(url, { 
            username, 
            password, 
            appVersion: "5.3.0" 
        });
        res.json({ success: true, client: client });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
