const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/test', auth , (req,res) => {
    res.json({
        message : "Task are working!!",
        user : req.user
    });
});

module.exports = router;