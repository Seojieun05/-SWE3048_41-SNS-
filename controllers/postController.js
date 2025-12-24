const Post = require("../models/Post")

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }) // Newest first

    res.render("main", {
      posts,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.render("main", {
      posts: [],
      user: req.session.user,
      error: "Failed to load posts",
    })
  }
}

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim() === "") {
      return res.render("newpost", {
        error: "Post content cannot be empty",
        user: req.session.user,
      })
    }

    const newPost = new Post({
      author: req.session.user.id,
      content: content.trim(),
      likes: 0,
      createdAt: new Date(),
    })

    await newPost.save()
    res.redirect("/main")
  } catch (error) {
    console.error("Create post error:", error)
    res.render("newpost", {
      error: "Failed to create post",
      user: req.session.user,
    })
  }
}

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const user = req.session.user

    const post = await Post.findById(postId)

    if (!post) {
      return res.redirect("/main")
    }

    // Check if user is author or admin
    const isAuthor = post.author === user.id
    const isAdmin = user.roles && user.roles.includes("admin")

    if (!isAuthor && !isAdmin) {
      return res.redirect("/main")
    }

    await Post.findByIdAndDelete(postId)
    res.redirect("/main")
  } catch (error) {
    console.error("Delete post error:", error)
    res.redirect("/main")
  }
}

// Like post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.session.user.id

    const post = await Post.findById(postId)

    if (!post) {
      return res.redirect("/main")
    }

    // Check if user already liked the post
    if (post.likedBy.includes(userId)) {
      // Unlike
      post.likedBy = post.likedBy.filter((id) => id !== userId)
      post.likes = Math.max(0, post.likes - 1)
    } else {
      // Like
      post.likedBy.push(userId)
      post.likes += 1
    }

    await post.save()
    res.redirect("/main")
  } catch (error) {
    console.error("Like post error:", error)
    res.redirect("/main")
  }
}

// Render new post page
exports.getNewPostPage = (req, res) => {
  res.render("newpost", {
    user: req.session.user,
    error: null,
  })
}
