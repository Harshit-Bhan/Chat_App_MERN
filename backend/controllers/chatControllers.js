const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel"); // Needed for User.populate

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // If chat exists, return it
  if (isChat.length > 0) {
    return res.status(200).send(isChat[0]);
  }

  // Otherwise, create new chat
  try {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate("users", "-password");

    return res.status(200).send(fullChat);
  } catch (error) {
    res.status(500);
    throw new Error("Chat creation failed: " + error.message);
  }
});

module.exports = { accessChat };
