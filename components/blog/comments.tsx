"use client";

import { FormEvent, useState } from "react";
import { Button, TextField } from "@mui/material";

export default function Comments(props: any) {
  const { comments, postId } = props;
  
  const [replyingTo, setReplyingTo] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");

  const getTopLevelComments = (comments: any[]) => comments.filter(c => c.replyto === null);
  const getReplies = (comments: any[], parentId: any) => comments.filter(c => c.replyto === parentId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>, replyto: null) {

    e.preventDefault();

    const body = {
      content: replyto ? newReplyContent : newCommentContent,
      blogpostid: postId,
      replyto: replyto || null,
    };

    const res = await fetch("/api/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    setNewCommentContent("");
    setNewReplyContent("");
    setReplyingTo(null);
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, null)}>
        <TextField
          multiline
          label="Add a comment"
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit">Submit</Button>
      </form>

      {getTopLevelComments(comments).map(comment => (
        <div key={comment.commentid} style={{ marginTop: "1em" }}>
          <div>
            <strong>{comment.userTitle}</strong> | {comment.datetimeposted}
          </div>
          <p>{comment.content}</p>
          <Button onClick={() => setReplyingTo(comment.commentid)}>Reply</Button>

          {replyingTo === comment.commentid && (
            <form onSubmit={(e) => handleSubmit(e, comment.commentid)}>
              <TextField
                multiline
                label="Write a reply"
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit">Submit Reply</Button>
              <Button type="button" onClick={() => setReplyingTo(null)}>Cancel</Button>
            </form>
          )}

          <div style={{ marginLeft: "20px" }}>
            {getReplies(comments, comment.commentid).map(reply => (
              <div key={reply.commentid}>
                <div>
                  <strong>{reply.userTitle}</strong> | {reply.datetimeposted}
                </div>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
