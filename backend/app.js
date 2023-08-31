const express = require("express");
const connectToDB = require("./config/connectToDB");
const { notFound, errorHandler } = require("./middlewares/error");
const cors = require("cors");
//important makes every file able to read .env file variables
require("dotenv").config();

// connection to DB
connectToDB();
// init app
const app = express();
// Middlewares
app.use(express.json());
// cors policy
app.use(cors({ origin: "http://localhost:3000" }));
// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
// Error handler
app.use(notFound);
app.use(errorHandler);
// Running the server
PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
