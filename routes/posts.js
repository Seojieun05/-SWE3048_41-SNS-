const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const { isAuthenticated } = require("../middleware/auth")

// Main page with all posts
router.get("/", isAuthenticated, postController.getPosts)

// Alias for main page
router.get("/main", isAuthenticated, (req, res) => res.redirect("/posts"))

// New post page
router.get("/new", isAuthenticated, postController.getNewPostPage)

// Create post handler
router.post("/new", isAuthenticated, postController.createPost)

// Delete post handler
router.post("/delete/:id", isAuthenticated, postController.deletePost)

// Like post handler
router.post("/like/:id", isAuthenticated, postController.likePost)

module.exports = router
