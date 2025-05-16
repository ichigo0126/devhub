"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 本の情報の型定義
interface Book {
  id: string;
  title: string;
  authors?: string[];
  imageUrl: string;
  publishedDate?: string;
  publisher?: string;
}

interface ReviewFormProps {
  onSubmit?: (data: {
    title: string;
    review: string;
    bookId?: string;
    bookImageUrl?: string;
    bookData?: Book;
  }) => void;
  buttonText?: string;
  buttonClassName?: string;
}

export function ReviewForm({
  onSubmit,
  buttonText = "レビューを投稿",
  buttonClassName = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
}: ReviewFormProps) {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualSearch, setManualSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Google Books APIから本を検索する関数
  const searchBooks = async (query: string) => {
    if (!query.trim()) return [];

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=5`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          imageUrl:
            item.volumeInfo.imageLinks?.thumbnail ||
            item.volumeInfo.imageLinks?.smallThumbnail ||
            "/placeholder-book.png",
          publishedDate: item.volumeInfo.publishedDate,
          publisher: item.volumeInfo.publisher,
        }));
      }
      return [];
    } catch (error) {
      console.error("本の検索に失敗しました:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // タイトルが変更されたときに検索を実行
  useEffect(() => {
    // 選択された本がある場合は検索しない（ただしmanualSearchがtrueの場合は検索する）
    if (selectedBook && !manualSearch) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (title.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const results = await searchBooks(title);
      setSearchResults(results);
      setManualSearch(false); // 検索が完了したらフラグをリセット
    }, 500); // 0.5秒のディレイを設定してタイピング中の過剰なリクエストを防止

    return () => clearTimeout(delayDebounceFn);
  }, [title, selectedBook, manualSearch]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title: selectedBook ? selectedBook.title : title,
        review,
        bookId: selectedBook?.id,
        bookImageUrl: selectedBook?.imageUrl,
        bookData: selectedBook || undefined,
      });
    }
    setTitle("");
    setReview("");
    setSelectedBook(null);
    setOpen(false);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={buttonClassName}>{buttonText}</button>
      </DialogTrigger>
      <DialogContent className="bg-white p-6 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            レビューを投稿
          </DialogTitle>
          <p className="text-sm text-gray-500">
            本の内容やレビューを入力してください。
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="title" className="text-sm font-medium">
              本のタイトル
            </label>
            <div className="flex gap-2">
              <input
                id="title"
                ref={inputRef}
                type="text"
                placeholder="本のタイトルを入力してください"
                className="border p-2 rounded flex-grow"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  // 本が選択されている状態で手動で編集した場合、選択状態をクリアする
                  if (selectedBook && e.target.value !== selectedBook.title) {
                    setSelectedBook(null);
                  }
                }}
                onFocus={() => {
                  if (title && !selectedBook) setIsSearching(true);
                }}
              />
            </div>

            {isSearching && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-10 mt-1 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    検索中...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectBook(book)}
                    >
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-12 h-16 object-cover mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-book.png";
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">{book.title}</div>
                        {book.authors && (
                          <div className="text-xs text-gray-500">
                            {book.authors.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    検索結果がありません
                  </div>
                )}
              </div>
            )}

            {/* 選択された本の表示 */}
            {selectedBook && (
              <div className="mt-2 flex items-center p-2 bg-gray-50 rounded">
                <img
                  src={selectedBook.imageUrl}
                  alt={selectedBook.title}
                  className="w-12 h-16 object-cover mr-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-book.png";
                  }}
                />
                <div>
                  <div className="text-sm font-medium">
                    {selectedBook.title}
                  </div>
                  {selectedBook.authors && (
                    <div className="text-xs text-gray-500">
                      {selectedBook.authors.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="review" className="text-sm font-medium">
              レビュー
            </label>
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
