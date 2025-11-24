"use client";

import { Button, Modal, Box } from "@mui/material";
import { RouteMatcher } from "next/dist/server/route-matchers/route-matcher";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteModal({ blogid, userid }: any) {
  const router = useRouter()

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = async () => {
    if (!userid) {
      router.push("/auth/login");
      return;
    }

    const res = await fetch("/api/deletePost", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid,
        blogid
      }),
    });

    if(res) {
      router.push("/profile")
      router.refresh()
    }
  }

  return (
    <div >
      <Button onClick={handleOpen} className="!bg-red-500 hover:!bg-red-600 !text-white !normal-case">Delete Post</Button>
        <Modal
          open={open}
          onClose={handleClose}
          className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-6"
        >
          <div className="w-full max-w-3xl h-fit bg-white shadow-md rounded-xl border border-purple-100 p-8 mt-80">
            <h2 className="text-2xl font-bold text-red-700 mb-8">Delete Blog Post?</h2>
            <p className="text-sm text-red-600 mb-3">
              Deleting this post will permanently all content.
            </p>
            <div className="flex justify-end gap-4 pt-6 border-t border-purple-100">
              <Button
                onClick={handleClick}
                className="!bg-red-500 hover:!bg-red-600 !text-white !normal-case"
              >
                Confirm Delete
              </Button>
              <Button 
                onClick={handleClose}
                className="!text-red-600 hover:!text-red-800 hover:!bg-red-200 !normal-case !border-red-500 !border !border-solid"
              >
                Cancel Delete
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
}