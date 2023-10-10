const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/store-data")
  .post(userController.checkObjectCount, userController.createUser);

router.route("/update-winner").patch(userController.updateWinner);

router.route("/update-score").patch(userController.updateScore);

router.route("/login").post(userController.login);
router
  .route("/update-share")
  .post(userController.protect, userController.updateShare);

router.route("/player-position/:id").get(userController.playerPosition);

router
  .route("/")
  .get(
    userController.protect,
    userController.restrictTo("admin"),
    userController.getAllUsers
  );
module.exports = router;
router.route("/admin-login").post(userController.adminLogin);
