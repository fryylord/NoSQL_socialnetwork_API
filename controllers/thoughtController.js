const { Thoughts, Users } = require("../models");

module.exports = {

getAllThoughts(req,res) {
    Thoughts.find({})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .sort({_id: -1})
    .then(dbThoughtsData => res.json(dbThoughtsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
},

getOneThought({ params }, res) {
    Thoughts.findOne({ _id: params.thoughtId })
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
        if(!dbThoughtsData) {
        res.status(404).json({message: 'No thought found!'});
        return;
    }
    res.json(dbThoughtsData)
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
},

createThought({ params, body }, res) {
    Thoughts.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user found!" });
        }

        res.json({ message: "Thought created!" });
      })
      .catch((err) => res.json(err));
  },

updateThought({ params, body }, res) {
    Thoughts.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought found!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

deleteThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: "No thought found!" });
        }

        return User.findOneAndUpdate(
          { thoughts: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought deleted but no user found!" });
        }
        res.json({ message: "Thought deleted!" });
      })
      .catch((err) => res.json(err));
  },

createReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought found" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

deleteReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtsData) => res.json(dbThoughtsData))
      .catch((err) => res.json(err));
  },
};