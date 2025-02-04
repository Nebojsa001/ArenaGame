const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const APIFeatures = require("../utils/apiFeatures");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

//generisanje tokena
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// slanje tokena
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//middleware
exports.checkObjectCount = (req, res, next) => {
  try {
    const data = req.body;
    if (data.length > 1) {
      return res
        .status(400)
        .json({ error: "Možete poslati samo jedan objekat u zahtjevu." });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Greška na serveru.", error: error.message });
  }
};
//middleware end

exports.getAllUsers = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .paginate();
    const users = await features.query;
    res.status(200).json({
      status: "success",
      result: users.length,
      users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.query;

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.playerPosition = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields();
    const user = await User.findById(req.params.id);
    const playerId = req.params.id;
    const users = await features.query;
    const playerPosition = await users.findIndex(
      (user) => user._id == playerId
    );
    const incrementedPlayerPosition = playerPosition + 1;
    res.status(200).json({
      status: "success",
      user: user.firstName,
      playerPosition: incrementedPlayerPosition,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password, //dodaj samo kad kreiras admina
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new appError("Proveri email i password", 400));
    }
    //2
    const user = await User.findOne({ email }).select("+password");

    //   compare pass = encrypted pass
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Pogrešan email ili password",
      });
    }
    //3
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, password });

    if (admin) {
      res.status(200).json({
        status: "success",
        message: "You are logged as admin",
      });
    } else {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const gameScore = req.body.gameScore;
    const counter = req.body.counter;
    const email = req.user.email;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { gameScore, counter } }
    );

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "Cant find user with your id",
      });
    } else {
      res.status(200).json({
        status: "success",
        _id: user._id,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateShare = async (req, res) => {
  try {
    const currentUser = req.user;
    console.log(currentUser);

    currentUser.socMediaShare = true;
    await currentUser.save();

    const userNickName = req.user.nickName;
    const userName = req.user.firstName;

    //generisanje pug template
    const templatePath = path.join(__dirname, "../templates/");
    const compiledFunction = pug.compileFile(
      path.join(templatePath, "arenaMailTemplate.pug")
    );
    const renderedTemplate = compiledFunction({ userName, userNickName });

    //mailer
    const to = req.user.email;
    const subject = "Arena Cloud Nagradna Igra";
    const html = renderedTemplate;
    const result = await sendEmail(to, subject, html);
    if (result.success) {
      console.log("radi");
    } else {
      console.log("nece");
    }

    res.status(200).json({
      status: "success",
      message: "Uspešno ste podelili",
      currentUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

//auth

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Nemate ovlašćenja za ovu radnju!",
      });
    }
    next();
  };
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Uloguj se!",
    });
  }
  //token verif
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Token nije ispravan. Molimo, prijavite se ponovo.",
    });
  }
};
