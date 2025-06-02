const db = require('./db');
const {FeedbackPost} = require('./schema')

async function getAllFeedback() {
    return await FeedbackPost.find();
}

async function addFeedback(data) {
    return await FeedbackPost.create(data);
}

async function deleteFeedback(id) {
    return await FeedbackPost.findByIdAndDelete(id);
}

module.exports = {
    getAllFeedback,
    addFeedback,
    deleteFeedback,
};