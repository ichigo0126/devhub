"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReviewFormProps {
  onSubmit?: (data: { title: string, review: string }) => void;
  buttonText?: string;
  buttonClassName?: string;
}

export function ReviewForm({ 
  onSubmit, 
  buttonText = "レビューを投稿", 
  buttonClassName = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
}: ReviewFormProps) {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ title, review });
    }
    setTitle("");
    setReview("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={buttonClassName}>
          {buttonText}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white p-6 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">レビューを投稿</DialogTitle>
          <p className="text-sm text-gray-500">本の内容やレビューを入力してください。</p>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium">本のタイトル</label>
            <input
              id="title"
              type="text"
              placeholder="本のタイトルを入力してください"
              className="border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="review" className="text-sm font-medium">レビュー</label>
            <textarea
              id="review"
              placeholder="この本についての感想を書いてください"
              className="border p-2 rounded h-32 resize-none"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              投稿する
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}