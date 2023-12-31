const express = require("express");
const sequelize = require("./util/database");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const { errorHandler } = require("./middlewares/errorHandler");

// Import Models
const User = require("./models/User");
const Event = require("./models/Event");

dotenv.config({ path: "config.env" });

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Route files
const users = require("./routes/users");
const profiles = require("./routes/profiles");
const events = require("./routes/events");

// Mount routers
app.use(users);
app.use(profiles);
app.use(events);

const PORT = process.env.PORT || 8080;

app.use(errorHandler);

// Relations
User.belongsToMany(User, {
  as: "followers",
  through: "Followers",
  foreignKey: "userId",
  timestamps: false,
});
User.belongsToMany(User, {
  as: "following",
  through: "Followers",
  foreignKey: "followerId",
  timestamps: false,
});

User.hasMany(Article, {
  foreignKey: "authorId",
  onDelete: "CASCADE",
});
Article.belongsTo(User, { as: "author", foreignKey: "authorId" });

User.hasMany(Comment, {
  foreignKey: "authorId",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, { as: "author", foreignKey: "authorId" });

E.hasMany(Comment, {
  foreignKey: "articleId",
  onDelete: "CASCADE",
});
Comment.belongsTo(Article, { foreignKey: "articleId" });

User.belongsToMany(Article, {
  as: "favorites",
  through: "Favorites",
  timestamps: false,
});

Event.belongsToMany(User, {
  through: "Favorites",
  foreignKey: "articleId",
  timestamps: false,
});

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  User.create({
    email: "test@test.com",
    password: "123456",
    username: "neo",
  });
  User.create({
    email: "test2@test.com",
    password: "123456",
    username: "celeb_neo",
  });
});

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
