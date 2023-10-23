import React, { useState } from "react";
import axios from "axios";

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
    <div className="comment">
      <p>{comment.content}</p>
      {comment.replies.map((reply) => (
        <div key={reply._id} className="reply">
          <p>{reply.content}</p>
        </div>
      ))}
      <div className="reply-input">
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Reply to this comment..."
        />
        <button onClick={handlePostReply}>Post Reply</button>
      </div>
    </div>
  );
};

export default Comment;
