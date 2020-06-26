// ==========================================
//
//  Express Server Routes
//
// ==========================================

// Node Packages
const router = require('express').Router(); // Express Router

// Controller Functions
const { deleteComment } = require('./delete-comment');
const { postComment } = require('./post-comment');
const { renderHeadlineComments } = require('./render-headline-comments');
const { renderHeadlines } = require('./render-headlines');

// GET Requests
router.get('/', (req, res) => renderHeadlines(res));
router.get('/comments', (req, res) => res.status(200).json(`/comments/${req.query.headlineId}`));
router.get('/comments/:id', (req, res) => renderHeadlineComments(req, res));

// POST Requests
router.post('/comments/:id', (req, res) => postComment(req, res));

// DELETE Requests
router.delete('/comments/:id', (req, res) => deleteComment(req, res));

module.exports = {
    routes: router
};