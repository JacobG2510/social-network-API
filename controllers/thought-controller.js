const { Thought } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .populate('reactions', '-__v')
      .select('-__v')
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(500).json(err));
  },

  getThoughtById(req, res) {
    const { id } = req.params;
    Thought.findById(id)
      .populate('reactions', '-__v')
      .select('-__v')
      .then(thought => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch(err => res.status(500).json(err));
  },

  createThought(req, res) {
    const { thoughtText, username, userId } = req.body;
    Thought.create({ thoughtText, username, userId })
      .then(newThought => {
        return User.findByIdAndUpdate(
          userId,
          { $push: { thoughts: newThought._id } },
          { new: true }
        );
      })
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(err => res.status(500).json(err));
  },

  updateThought(req, res) {
    const { id } = req.params;
    const { thoughtText } = req.body;
    Thought.findByIdAndUpdate(
      id,
      { thoughtText },
      { new: true, runValidators: true }
    )
      .then(updatedThought => {
        if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
      })
      .catch(err => res.status(500).json(err));
  },

  deleteThought(req, res) {
    const { id } = req.params;
    Thought.findByIdAndDelete(id)
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(deletedThought);
      })
      .catch(err => res.status(500).json(err));
  },

  addReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;
    Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    )
      .then(updatedThought => {
        if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
      })
      .catch(err => res.status(500).json(err));
  },
  
  removeReaction(req, res) {
    const { thoughtId, reactionId } = req.params;
    Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    )
      .then(updatedThought => {
        if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
      })
      .catch(err => res.status(500).json(err));
  }
};

module.exports = thoughtController;