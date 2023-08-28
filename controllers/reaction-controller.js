const { Thought } = require('../models');

const reactionController = {
  removeReaction(req, res) {
    const { thoughtId, reactionId } = req.params;

    Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId } } },
      { new: true }
    )
      .populate('reactions') 
      .then(updatedThought => {
        if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
      })
      .catch(err => res.status(500).json(err));
  }
};

module.exports = reactionController;