const { User } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts friends',
        select: '-__v'
      })
      .select('-__v')
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  },
  
  getUserById(req, res) {
      const { id } = req.params;
      User.findById(id)
        .populate({
          path: 'thoughts friends',
          select: '-__v'
        })
        .select('-__v')
        .then(user => {
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
        })
        .catch(err => res.status(500).json(err));
  },

  createUser(req, res) {
    const { username, email } = req.body;
    User.create({ username, email })
      .then(newUser => res.json(newUser))
      .catch(err => res.status(500).json(err));
  },

  updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;
    User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true }
    )
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
      })
      .catch(err => res.status(500).json(err));
  },

  deleteUser(req, res) {
    const { id } = req.params;
    User.findByIdAndDelete(id)
      .then(deletedUser => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(deletedUser);
      })
      .catch(err => res.status(500).json(err));
  },

  addFriend(req, res) {
      const { userId, friendId } = req.params;
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      )
        .then(updatedUser => {
          if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(updatedUser);
        })
        .catch(err => res.status(500).json(err));
  },

  removeFriend(req, res) {
    const { userId, friendId } = req.params;
    User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    )
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
      })
      .catch(err => res.status(500).json(err));
  }
};

module.exports = userController;