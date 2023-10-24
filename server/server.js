import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://owaisnazir110928:HafsaOwais123@cluster0.ll8oxdv.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "owaisnazir201@gmail.com",
    pass: "nwau faup bcnw kttp",
  },
});

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  verified: Boolean,
});

const User = mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
});

const OTP = mongoose.model("OTP", otpSchema);

const topicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Comment = mongoose.model("Comment", commentSchema);
const Topic = mongoose.model("Topic", topicSchema);

app.post("/api/send-otp", (req, res) => {
  const { email } = req.body;
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: "owaisnazir201@gmail.com",
    to: email,
    subject: "Verification Code",
    text: `Your OTP for verification is: ${otpCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      const otp = new OTP({ email, code: otpCode });
      otp
        .save()
        .then(() => {
          res.json({ message: "OTP sent successfully" });
        })
        .catch((error) => {
          console.error("Error saving OTP to the database:", error);
          res.status(500).json({ error: "Failed to send OTP" });
        });
    }
  });
});
app.post("/api/verify-otp", (req, res) => {
  const { name, email, otp } = req.body;
  OTP.findOne({ email, code: otp })
    .then((otpRecord) => {
      if (otpRecord) {
        User.findOne({ email })
          .then((existingUser) => {
            if (existingUser) {
              res.json({
                message: "User is already verified",
                id: existingUser._id,
              });
            } else {
              const newUser = new User({ name, email, verified: true });
              newUser
                .save()
                .then((savedUser) => {
                  res.json({
                    message: "User verified and saved successfully",
                    id: savedUser._id,
                  });
                })
                .catch((error) => {
                  res.status(500).json({ error: "Failed to save user" });
                });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: "Failed to verify user" });
          });
      } else {
        res.status(400).json({ error: "Incorrect OTP" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to verify OTP" });
    });
});

app.get("/api/topics", async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("user", "name email")
      .populate({
        path: "comments",
        populate: {
          path: "replies", // Populate replies to comments as well if needed
        },
      });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

app.post("/api/topics", async (req, res) => {
  const { userId, content } = req.body;

  try {
    const newTopic = new Topic({
      user: userId,
      content: content,
    });

    await newTopic.save();

    res.json(newTopic);
  } catch (error) {
    console.error("Error posting topic:", error);
    res.status(500).json({ error: "Failed to post topic" });
  }
});

app.post("/api/topics/:topicId/comments", async (req, res) => {
  const { userId, content } = req.body;
  const topicId = req.params.topicId;

  try {
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const newComment = new Comment({
      user: userId,
      content: content,
      replies: [],
    });

    topic.comments.push(newComment);

    await newComment.save();
    await topic.save();

    res.json(newComment);
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});
app.post(
  "/api/topics/:topicId/comments/:commentId/replies",
  async (req, res) => {
    const { userId, content } = req.body;
    const topicId = req.params.topicId;
    const commentId = req.params.commentId;

    try {
      // Check if the comment with the given ID exists and belongs to the topic with the given ID.
      const comment = await Comment.findById(commentId);

      // Create a new Comment object with the following properties:
      const newReply = new Comment({
        user: userId,
        content: content,
        replies: [],
      });

      // Save the new Comment object to the database.
      await newReply.save();

      // Add the new Comment object to the replies array of the original comment.
      comment.replies.push(newReply);

      // Update the original comment in the database.
      await comment.save();

      // Return a success response with the new Comment object.
      res.json(newReply);
    } catch (error) {
      console.error("Error posting reply:", error);
      res.status(500).json({ error: "Failed to post reply" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
