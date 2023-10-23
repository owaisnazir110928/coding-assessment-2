import React, { useState } from "react";
import axios from "axios";
import styles from "./Style/Comment.module.css";
const Comment = ({ comment, topicId }) => {
  const [replyContent, setReplyContent] = useState("");

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
      })
      .catch((error) => {
        console.error("Error posting reply:", error);
      });
  };

  return (
    <div className={styles.comment}>
      <p className={styles.commentContent}>{comment.content}</p>
      {comment.replies.map((reply) => (
        <div key={reply._id} className={styles.reply}>
          <p className={styles.replyContent}>{reply.content}</p>
        </div>
      ))}
      <div>
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
    </div>
  );
};

export default Comment;
