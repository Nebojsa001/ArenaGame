const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/store-data")
  .post(userController.checkObjectCount, userController.createUser);

router
  .route("/update-score")
  .patch(userController.protect, userController.updateScore);

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

router.route("/top-users").get(userController.getTopUsers);
router.route("/admin-login").post(userController.adminLogin);
module.exports = router;
