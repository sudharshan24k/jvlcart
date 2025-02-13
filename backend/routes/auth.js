const express = require('express');
const { registerUser, loginUser , logoutUser,
     forgotPassword, resetPassword, getUserProfile,changePassword,
     updateProfile,getAllUsers,getUser,updateUser,deleteUser} = require('../controllers/authController');

const { model } = require('mongoose');
const router = express.Router();
const {isAuthenticatedUser, authoriseRoles} = require("../middlewares/authenticate");

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

router.route('/myprofile').get(isAuthenticatedUser , getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, changePassword);

router.route('/update').put(isAuthenticatedUser,updateProfile);

//admin routes

router.route('/admin/users').get(isAuthenticatedUser,authoriseRoles('admin'),getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authoriseRoles('admin'),getUser);
router.route('/admin/user/:id').put(isAuthenticatedUser,authoriseRoles('admin'),updateUser);
router.route('/admin/user/:id').delete(isAuthenticatedUser,authoriseRoles('admin'),deleteUser);

module.exports = router;