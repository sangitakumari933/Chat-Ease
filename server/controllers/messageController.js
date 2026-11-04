import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";
import { io, userSocketMap } from "../server.js";


export const getUserForSideBar = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUsers = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password",
    );

    //count number of unseen messages

    const userPromises = otherUsers.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: currentUserId, receiverId: user._id },
          { senderId: user._id, receiverId: currentUserId },
        ],
      }).sort({ createdAt: -1 });

      const unseenCount = await Message.countDocuments({
        senderId: user._id,
        receiverId: currentUserId,
        seen: false,
      });

      console.log("reached end");

      return {
        ...user.toObject(),
        unseenCount,
        sortTimestamp: lastMessage
          ? new Date(lastMessage.createdAt).getTime()
          : 0,
      };
    });

    const usersWithTimestamps = await Promise.all(userPromises);
    usersWithTimestamps.sort((a, b) => b.sortTimestamp - a.sortTimestamp);
    const finalUsers = usersWithTimestamps.map(
      ({ sortTimestamp, ...user }) => user,
    );
    console.log(finalUsers);
    res.json({ success: true, users: finalUsers });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//get all messages for selected users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      {
        seen: true,
      },
    );

    return res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//send messages to selected user
export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    console.log(req.body);
    let text = "";
    if (req.body.text) {
      text = req.body.text;
    }

    let imageUrl = "";
    if (req.file) {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            console.log(error);
            return;
          }

          console.log(result.secure_url);
        })
        .end(req.file.buffer);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    //emit the new message to the receiver's socketId
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.emit("newMessage", newMessage);
    }

    return res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
  }
};
