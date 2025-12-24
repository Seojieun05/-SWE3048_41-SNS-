# SNS Application

A basic Social Networking Service (SNS) web application built with Node.js, Express, MongoDB, and EJS templates.

## Features

- User Authentication (Login/Signup)
- Session Management
- Create, View, and Delete Posts
- Like/Unlike Posts
- Admin Role Support
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository or download the ZIP file

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string and session secret.

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the application:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── postController.js    # Post management logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model
│   └── Post.js              # Post model
├── public/
│   └── css/
│       └── style.css        # Styles
├── routes/
│   ├── auth.js              # Auth routes
│   └── posts.js             # Post routes
├── views/
│   ├── login.ejs            # Login page
│   ├── signup.ejs           # Signup page
│   ├── main.ejs             # Main feed page
│   ├── newpost.ejs          # New post page
│   └── error.ejs            # Error page
├── server.js                # Main application file
├── package.json
└── README.md
```

## Creating an Admin User

To create an admin user, you can either:

1. Register a normal user and then update their roles in MongoDB:
```javascript
db.users.updateOne(
  { id: "username" },
  { $set: { roles: ["user", "admin"] } }
)
```

2. Or create a seed script to add an admin user directly.

## API Routes

### Authentication
- `GET /login` - Login page
- `POST /login` - Login handler
- `GET /signup` - Signup page
- `POST /signup` - Signup handler
- `GET /logout` - Logout handler

### Posts
- `GET /main` or `GET /posts` - Main feed
- `GET /posts/new` - New post page
- `POST /posts/new` - Create post handler
- `POST /posts/delete/:id` - Delete post
- `POST /posts/like/:id` - Like/Unlike post
