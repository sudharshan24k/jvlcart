const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

require("dotenv").config();


// Registration of new user -->/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);
});

// User Login --> /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password1", 400));
    }

    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Email or Password2", 400));
    }

    sendToken(user, 200, res);
});


//Logging out --> /api/v1/logout
exports.logoutUser = (req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    }).status(200)
      .json({
        success:true,
        message: "logged out successfully"
     })
}


//Forgot Password --> /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }); 

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false }); // 

    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const message = `Your password reset URL is as follows: \n\n ${resetUrl} \n\n If you did not request this email, please ignore it.`

    try {
        await sendEmail({  // 
            email: user.email,
            subject: 'Website Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password --> /api/v1/password/reset/
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() } 
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400)); // Fix: Add status code
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res); 
});


//Get user profile 
exports.getUserProfile = catchAsyncError(async(req,res,next)=>{
     const user = await User.findById(req.user.id)
     res.status(200).json({
        success:true,
        user
     })

})


//change Password --> api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!req.body.oldPassword || !req.body.password) {
        return next(new ErrorHandler("Please provide both old and new passwords", 400));
    }

    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler("Old password is incorrect", 401));
    }

    if (req.body.oldPassword === req.body.password) {
        return next(new ErrorHandler("New password cannot be the same as the old password", 400));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});


//update Profile --> /api/v1/admin/users

exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        user
    })

})


//ADMIN : GetAllusers --> api/v1/admin/user/:id
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//ADMIN : GetspecificUser --> - api/v1/admin/user/:id
exports.getUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.findById(req.params.id);
    if(!users){
        return next(new ErrorHandler(`User Not Found with this ${id}`))
    }
    res.status(200).json({
        success:true,
        users
    })
})

exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message:"user deleted successfully"
    })
})