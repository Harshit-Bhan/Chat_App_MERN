const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require('../config/generateToken');
const Chat = require("../models/chatModel");

const registerUser = asyncHandler(async (req,res) => {
    const {name , email , password , pic} = req.body;

    if(!name || !email || !password )
    {
        res.status(400);
        throw new Error("Please Enter all the fields")
    }

    const userExists = await User.findOne({email});

    if (userExists)
    {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user)
    {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400);
        throw new Error('Failed to create the User');
    }

});

const authUser = asyncHandler(async (req,res) => {
    const { email , password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
        console.log(`Welcome , ${user.name}`)
            }
    else
    {
        res.status(400);
        throw new Error("Invalid Email or Password")
    }

})

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    } : {};

    const users = await User.find(keyword).find({_id:{$ne :req.user._id}}).select("-password");
    res.send(users);
});

const renameGroup = asyncHandler(async (req,res) => {
    const { chatId , chatName } = req.body;

    if (!chatId || !chatName) {
    return res.status(400).send({ message: "chatId and chatName are required." });
    }

    try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true } 
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).send({ message: "Chat not found." });
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to rename the group: " + error.message);
  }

})

const addToGroup = asyncHandler(async (req,res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId , {
        $push : { users: userId },
        },
    {new : true}
) .populate('users','-password').populate('groupAdmin','-password');

if (!added) {
    return res.status(404).send({ message: "Chat not found." });
} else{
    res.status(200).json(added);
}
});

const removeFromGroup = asyncHandler(async (req,res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId , {
        $pull : { users: userId },
        },
    {new : true}
) .populate('users','-password').populate('groupAdmin','-password');

if (!removed) {
    return res.status(404).send({ message: "Chat not found." });
} else{
    res.status(200).json(removed);
}
});


module.exports = { registerUser , authUser , allUsers, renameGroup , addToGroup , removeFromGroup }
