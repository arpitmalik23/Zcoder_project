const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const cors = require("cors");


const app = express();
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Example route (if needed)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


dotenv.config();


app.use(express.json());


app.use(cors());



app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => console.log(err));


// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// // Initialize app
// const app = express();
// dotenv.config();

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse incoming JSON

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zcoder', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Sample route for community posts
// app.get('/api/posts', (req, res) => {
//   res.json([
//     { id: 1, author: 'Alice', title: 'First Post', content: 'This is the first community post.' },
//     { id: 2, author: 'Bob', title: 'Second Post', content: 'Welcome to ZCoder community!' }
//   ]);
// });

// // Other route handlers (plug in your routes here)
// const authRoutes = require('./routes/auth'); // Example: ./routes/auth.js
// const commentRoutes = require('./routes/comments'); // Example: ./routes/comments.js

// app.use('/api/auth', authRoutes);
// app.use('/api/comments', commentRoutes);

// // Serve frontend files (optional, if using HTML directly)
// app.use(express.static(path.join(__dirname, '../frontend'))); // Adjust if your frontend is elsewhere

// // Default fallback
// app.get('*', (req, res) => {
//   res.status(404).send('API route not found');
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
