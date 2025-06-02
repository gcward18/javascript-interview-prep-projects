const express = require('express');
const feedbackService = require('./feedbackService');
const commentService = require('./commentService');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const {FeedbackPost, Comment} = require('./schema');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// connect to mongoDB
connectDB();

app.get('/feedback', async (req, res) => {
    try {
        const posts = await FeedbackPost.find()
        res.json(posts)
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch feedback'});
    }
});

app.post('/feedback', async (req, res) => {
    try {
        const post = await feedbackService.addFeedback(req.body);
        res.status(201).json({result: post});
    } catch (err) {
        res.status(500).json({error: 'Failed to add feedback : ' + err});
    }
});

app.delete('/feedback', async (req, res) => {
    try {

        console.log(req.body)
        const result = await feedbackService.deleteFeedback(req.body.id);
        console.log(result);
        if (result.deleteCount == 0) {
            res.status(404).json({error: "Feedback not found"});
        } else {
            res.status(200).json({message: 'Feedback deleted'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to delete feedback'});
    }
})

app.get('/comment', async (req, res) => {
    try {
        const posts = await commentService.find()
        res.json(posts)
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch comment'});
    }
});

app.post('/comment', async (req, res) => {
    try {
        const post = await commentService.addComment(req.body);
        res.status(201).json({insertedId: result.insertedId});
    } catch (err) {
        res.status(500).json({error: 'Failed to add comment'});
    }
});

app.delete('/comment', async (req, res) => {
    try {
        const result = await commentService.deleteComment(req.body);
        if (result.deleteCount == 0) {
            res.status(404).json({error: "comment not found"});
        } else {
            res.status(200).json({message: 'comment deleted'});
        }
    } catch (err) {
        res.status(500).json({error: 'Failed to delete comment'});
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});