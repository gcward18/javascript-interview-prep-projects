const db = require('./db');
const {Comment} = require('./schema');

async function getAllComments() {
    return await Comment.find();
}

async function addComment(data) {
    return Comment.create(data);
}

async function deleteComment(id) {
    return Comment.findByIdAndDelete(id);
}

module.exports = {
    getAllComments,
    addComment,
    deleteComment,
};