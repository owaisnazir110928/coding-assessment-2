import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Style/Comment.module.css";

const Comment = ({ comment, topicId }) => {
  const [replyContent, setReplyContent] = useState("");
  const [viewReplies, setViewReplies] = useState(false);
  const [commentReplies, setCommentReplies] = useState(comment.replies);
  const [userName, setUserName] = useState(""); // State to store user's name

  // Fetch user details based on the user ID
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://codinground.onrender.com/api/users/${comment.user}`
        );
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [comment.user]); // Fetch user details when the user ID changes

  const handlePostReply = () => {
    const userId = localStorage.getItem("userId");

    axios
      .post(
        `https://codinground.onrender.com/api/topics/${topicId}/comments/${comment._id}/replies`,
        {
          userId,
          content: replyContent,
        }
      )
      .then((response) => {
        console.log("Reply posted:", response.data);
        setReplyContent("");

        // Update the local state with the new reply
        setCommentReplies([...commentReplies, response.data]);
      })
      .catch((error) => {
        console.error("Error posting reply:", error);
      });
  };

  return (
    <div className={styles.comment}>
      <p className={styles.commentContent}>{comment.content}</p>
      <div
        className={styles.viewReplies}
        onClick={() => {
          setViewReplies(!viewReplies);
        }}
      >
        {`View Replies (${commentReplies.length})`}
      </div>
      {viewReplies && (
        <>
          {commentReplies.map((reply) => (
            <div key={reply._id} className={styles.reply}>
              <p className={styles.replyContent}>{reply.content}</p>
            </div>
          ))}
          <div className={styles.replyInputContainer}>
            <textarea
              className={styles.replyInput}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Reply to this comment..."
            />
            <button className={styles.button} onClick={handlePostReply}>
              Post Reply
            </button>
          </div>
        </>
      )}
      <p className={styles.userName}>User: {userName}</p>
    </div>
  );
};

export default Comment;
