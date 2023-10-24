import React, { useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import styles from "./Style/Topic.module.css";
import cmtIcon from "../assets/comment.svg";

const Topic = ({ topic }) => {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState(topic.comments);
  const [viewComments, setViewComments] = useState(false);

  const handlePostComment = () => {
    const userId = localStorage.getItem("userId");

    axios
      .post(
        `https://codinground.onrender.com/api/topics/${topic._id}/comments`,
        {
          userId,
          content: commentContent,
        }
      )
      .then((response) => {
        setComments([...comments, response.data]);
        setCommentContent("");
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  };

  const handlePostReply = (commentId, reply) => {
    const updatedComments = comments.map((comment) => {
      if (comment._id === commentId) {
        comment.replies.push(reply);
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <div className={styles.topic}>
      <h1 className={styles.name}>{topic.user.name}</h1>
      <p className={styles.topicContent}>{topic.content}</p>
      <div
        className={styles.iconContainer}
        onClick={() => {
          setViewComments(!viewComments);
        }}
      >
        <img src={cmtIcon} alt="icon" className={styles.icon} />
        {` View Comments (${comments.length})`}
      </div>
      {viewComments && (
        <div className={styles.commentContainer}>
          {" "}
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postReply={handlePostReply}
              topicId={topic._id.toString()}
            />
          ))}
          <div className={styles.commentInputContainer}>
          <textarea
            className={styles.commentInput}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Comment on this topic..."
          />
          <button onClick={handlePostComment} className={styles.button}>
            Post Comment
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topic;
