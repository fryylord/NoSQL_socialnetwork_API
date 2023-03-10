const {Users} = require('../models');

module.exports = {

getAllUsers(req, res) {
    Users.find({})
    .populate({path: 'thoughts', select: '-__v'})
    .populate({path: 'friends', select: '-__v'})
    .select('-__v')
    .sort({_id: -1})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
},

getOneUser({ params }, res) {
    Users.findOne({ _id: params.userId })
    .populate({path: 'thoughts', select: '-__v'})
    .populate({path: 'friends', select: '-__v'})
    .select('-__v')
    .then(dbUserData => {
        if(!dbUserData) {
        res.status(404).json({message: 'No user found!'});
        return;
    }
    res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
},

createUser(req, res) {
    Users.create(req.body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(500).json(err));
},

updateUser(req, res) {
    Users.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true })
    .then((dbUserData) => {
        if (!dbUserData) {res.status(404).json({ message: 'No user found!' }); 
        return;}
        res.json(dbUserData);
    })
    .catch((err) => res.status(500).json(err));
},

deleteUser(req, res) {
    Users.findOneAndDelete({ _id: req.params.userId })
    .then((dbUserData) => {
        if (!dbUserData) {res.status(404).json({ message: 'No user found!' }); 
        return;}
        res.json(dbUserData);
    })
    .catch((err) => res.status(500).json(err));
},

addFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },

deleteFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  }
};
