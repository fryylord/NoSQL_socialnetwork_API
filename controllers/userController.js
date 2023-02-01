const {User} = require('../models');

module.exports = {

getAllUsers(req, res) {
    User.find({})
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
    User.findOne({ _id: params.id })
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
}

}
