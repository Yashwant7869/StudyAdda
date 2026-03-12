const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Configure dotenv for environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import routers
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const authorRouter = require("./routes/authorRouter");
const borrowalRouter = require("./routes/borrowalRouter");
const genreRouter = require("./routes/genreRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const seatRouter = require("./routes/seatRouter");
const checkInRouter = require("./routes/checkInRouter");
const paymentRouter = require("./routes/paymentRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const memberRouter = require("./routes/memberRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// Logging
app.use(logger("dev"));

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB on MongoDB Atlas'))
  .catch((err) => console.log('DB connection error', err));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Cookie parser
app.use(cookieParser(process.env.SESSION_SECRET));

// Passport
app.use(passport.initialize());
app.use(passport.session());
const initializePassport = require("./passport-config");
initializePassport(passport);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/author", authorRouter);
app.use("/api/borrowal", borrowalRouter);
app.use("/api/genre", genreRouter);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/seat", seatRouter);
app.use("/api/checkin", checkInRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/member", memberRouter);

app.get('/', (req, res) => res.send('StudyAdda Library Management API'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
