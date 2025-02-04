const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
    trim: true,
  },
  nickName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user must have a mail"],
    unique: [true, "A user mail must be unique"],
    validate: [validator.isEmail, "Neispravna email adresa"],
  },
  phone: {
    type: String,
    required: [true, "A user must have a phone number"],
    unique: [true, "A user phone number must be unique"],
    validate: {
      validator: function (value) {
        return /^(\+381|0)[0-9]{6,}$/.test(value);
      },
      message: "Neispravan broj telefona za Srbiju",
    },
  },
  gameScore: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "user",
  },
  socMediaShare: {
    type: Boolean,
    default: false,
  },
  counter: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
});

//ova linija koda treba samo kad zelimo dodati admina i ne koristi se kod obicnih korisnika bez sifre (61-64)
// userSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, 12);
// });
userSchema.methods.correctPassword = async function (
  // PROVJERA PASSWORD
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", function (next) {
  this.nickName = `ArenaPlayer_${this.firstName}${Date.now()
    .toString()
    .slice(-5)}`;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
