"use client";

import { FormEvent, useState } from "react";
import { Button, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function Comments(props: any) {
  const router = useRouter()

  const { comments, postId, userId } = props;

  const [replyingTo, setReplyingTo] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");

  const getTopLevelComments = (comments: any[]) => comments.filter(c => c.replyto === null);
  const getReplies = (comments: any[], parentId: any) => comments.filter(c => c.replyto === parentId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>, replyto: null) {

    e.preventDefault();

    if (!userId) return

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
    router.refresh();
  }

  return (
    <div className="space-y-6 mt-6">
      { userId && <form onSubmit={(e) => handleSubmit(e, null)} className="flex flex-col gap-2">
        <TextField
          multiline
          label="Add a comment..."
          className="border-purple-200"
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          className="buttonPrimary"
        >
          Submit
        </Button>
      </form>}

      {getTopLevelComments(comments).map((comment) => (
        <div key={comment.commentid} className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">
            <strong className="text-purple-700">{comment.userTitle}</strong> •{" "}
            {dayjs(comment.datetimeposted).format("MMM D, YYYY h:mm A")}
          </div>
          <p className="text-gray-700">{comment.content}</p>

          { userId && <div className="mt-2 -ml-3">
            <Button
              onClick={() => setReplyingTo(comment.commentid)}
              className="!text-purple-500 !normal-case"
            >
              Reply
            </Button>
          </div>}

          {replyingTo === comment.commentid && (
            <form onSubmit={(e) => handleSubmit(e, comment.commentid)} className="mt-2 space-y-2">
              <TextField
                multiline
                label="Write a reply..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                fullWidth
                className="border-purple-200"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="buttonPrimary"
                >
                  Submit Reply
                </Button>
                <Button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="buttonSecondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="pl-5 mt-3 border-l-2 border-purple-200 space-y-3">
            {getReplies(comments, comment.commentid).map((reply) => (
              <div key={reply.commentid} className="text-sm">
                <div className="text-gray-500 mb-1">
                  <strong className="text-purple-700">{reply.userTitle}</strong> •{" "}
                  {dayjs(reply.datetimeposted).format("MMM D, YYYY h:mm A")}
                </div>
                <p className="text-gray-700">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
