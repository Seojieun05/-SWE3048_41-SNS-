const User = require("../models/User")

exports.signupUser = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body

    // Validation
    if (!username || !password || !confirmPassword) {
      return res.render("signup", {
        error: "All fields are required",
        username: username || "",
      })
    }

    if (password !== confirmPassword) {
      return res.render("signup", {
        error: "Passwords do not match",
        username,
      })
    }

    if (password.length < 4) {
      return res.render("signup", {
        error: "Password must be at least 4 characters",
        username,
      })
    }

    // Check if username already exists
    const existingUser = await User.findOne({ id: username })
    if (existingUser) {
      return res.render("signup", {
        error: "Username is already taken",
        username,
      })
    }

    // Create new user (password is hashed in pre-save hook)
    const newUser = new User({
      id: username,
      password: password,
      roles: ["user"],
    })

    await newUser.save()

    // Redirect to login page
    res.redirect("/login?registered=true")
  } catch (error) {
    console.error("Signup error:", error)
    res.render("signup", {
      error: "An error occurred during registration",
      username: req.body.username || "",
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
      return res.render("login", {
        error: "Username and password are required",
        username: username || "",
      })
    }

    // Find user
    const user = await User.findOne({ id: username })
    if (!user) {
      return res.render("login", {
        error: "Invalid username or password",
        username,
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid username or password",
        username,
      })
    }

    // Initialize session
    req.session.user = {
      id: user.id,
      roles: user.roles,
    }

    res.redirect("/main")
  } catch (error) {
    console.error("Login error:", error)
    res.render("login", {
      error: "An error occurred during login",
      username: req.body.username || "",
    })
  }
}

// Logout User
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/login")
  })
}
