// Assuming you have Express and Mongoose set up

const express = require('express');
const router = express.Router();
const Phone = require('../models/phone');

router.get('/search', (req, res) => {
    res.render('search');
});

router.post('/search', async (req, res) => {
    const keywords = req.body.keywords;
    
    try {
        const phones = await Phone.find({
            $or: [
                { esn: { $regex: keywords, $options: 'i' } },
                { model: { $regex: keywords, $options: 'i' } },
                { carrier: { $regex: keywords, $options: 'i' } },
                { barcode: { $regex: keywords, $options: 'i' } },
                { PhRmLoc: { $regex: keywords, $options: 'i' } },
                { CurLoc: { $regex: keywords, $options: 'i' } },
                { Note: { $regex: keywords, $options: 'i' } },
                // Add other fields as needed
            ]
        });

        res.render('search', { phones });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
