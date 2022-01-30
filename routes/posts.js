const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create a post
router.post('/', async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json("the post has been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const id = (req.params.id).trim()
        const post = await Post.findById(id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted");
        } else {
            res.status(403).json("you can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//like or dislike a post
router.put('/like/:id', async (req, res) => {
    try {
        const id = (req.params.id).trim();
        const post = await Post.findById(id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//get a post
router.get('/:id', async (req, res) => {
    try {
        const id = (req.params.id).trim();
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        console.log(currentUser)
        const userPosts = await Post.find({
            userId: currentUser._id
        });
        console.log(userPosts)
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({
                    userId: friendId
                });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;