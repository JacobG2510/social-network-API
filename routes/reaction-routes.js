const router = require('express').Router();
const reactionController = require('../controllers/reaction-controller');

router.delete('/:reactionId', reactionController.removeReaction);

module.exports = router;