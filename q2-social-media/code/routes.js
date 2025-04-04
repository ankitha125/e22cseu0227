
const express = require('express');
const services = require('./services');

const router = express.Router();
router.get('/users', async (req, res) => {
    try {

        const topUsers = await services.getTopUsers();
     
        res.json(topUsers);
    } catch (error) {

        console.log('Error while getting top users:', error.message);
        res.status(500).json({
            error: 'Could not get top users',
            message: error.message
        });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const type = req.query.type;
        if (type !== 'popular' && type !== 'latest') {
            return res.status(400).json({
                error: 'Invalid type parameter',
                message: 'Type must be either "popular" or "latest"',
                example: '/posts?type=popular or /posts?type=latest'
            });
        }
        const posts = await services.getPosts(type);
        res.json(posts);
    } catch (error) {
        console.log(`Error while getting ${req.query.type} posts:`, error.message);
        res.status(500).json({
            error: `Could not get ${req.query.type} posts`,
            message: error.message
        });
    }
});
module.exports = router;
