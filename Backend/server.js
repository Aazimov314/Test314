const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');

const app = express();
app.use(cors());

// Increase JSON payload limit to maximum
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 1024 } // 1 GB limit
});

app.post("/api", upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileBuffer = req.file.buffer;
    
    pdf(fileBuffer).then(data => {
        res.json({ text: data.text });
    }).catch(err => {
        console.error('Error parsing PDF:', err);
        res.status(500).send('Error parsing PDF: ' + err.message);
    });
});

app.listen(8000, () => {
    console.log("Server has started on port 8000");
});



