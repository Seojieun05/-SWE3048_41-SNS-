const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const path = require("path")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")

const app = express()

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nodejs"

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
)

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

// View Engine Setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Routes
app.use("/", authRoutes)
app.use("/posts", postRoutes)

// Home Route - Redirect to login or main
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/main")
  } else {
    res.redirect("/login")
  }
})

app.get("/main", (req, res) => {
  if (req.session.user) {
    res.redirect("/posts")
  } else {
    res.redirect("/login")
  }
})

app.get("/newpost", (req, res) => {
  if (req.session.user) {
    res.redirect("/posts/new")
  } else {
    res.redirect("/login")
  }
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", { message: "Something went wrong!" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
