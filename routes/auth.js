const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { isAuthenticated, isNotAuthenticated } = require("../middleware/auth")

// Login page
router.get("/login", isNotAuthenticated, (req, res) => {
  const registered = req.query.registered === "true"
  res.render("login", {
    error: null,
    username: "",
    success: registered ? "Registration successful! Please log in." : null,
  })
})

// Login handler
router.post("/login", isNotAuthenticated, authController.loginUser)

// Signup page
router.get("/signup", isNotAuthenticated, (req, res) => {
  res.render("signup", { error: null, username: "" })
})

// Signup handler
router.post("/signup", isNotAuthenticated, authController.signupUser)

// Logout handler
router.get("/logout", isAuthenticated, authController.logoutUser)

module.exports = router
