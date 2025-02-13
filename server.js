const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/log', (req, res) => {
    const logEntry = req.body.logEntry;
    fs.appendFile('pomodoro_log.txt', logEntry, (err) => {
        if (err) {
            res.status(500).send('Error logging session');
        } else {
            res.status(200).send('Session logged');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
