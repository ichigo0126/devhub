"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/ReviewForm";

// 本の詳細情報の型定義
interface BookDetail {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  publisher?: string;
  publishedDate?: string;
  imageUrl?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

// レビューの型定義
interface Review {
  id: string;
  userName: string;
  userImage: string;
  date: string;
  content: string;
  rating: number;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  // HTTPリンクをHTTPSに変換する関数
  const secureImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // HTTP URLをHTTPSに変換
    if (url.startsWith("http:")) {
      return url.replace("http:", "https:");
    }
    return url;
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // Google Books APIから本の詳細情報を取得
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const data = await response.json();

        if (data.id) {
          // 画像URLを安全に取得
          let imageUrl;
          if (data.volumeInfo.imageLinks) {
            imageUrl = secureImageUrl(
              data.volumeInfo.imageLinks.thumbnail ||
                data.volumeInfo.imageLinks.smallThumbnail
            );
          }

          const bookDetail: BookDetail = {
            id: data.id,
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors,
            description: data.volumeInfo.description,
            publisher: data.volumeInfo.publisher,
            publishedDate: data.volumeInfo.publishedDate,
            imageUrl: imageUrl,
            pageCount: data.volumeInfo.pageCount,
            categories: data.volumeInfo.categories,
            averageRating: data.volumeInfo.averageRating,
            ratingsCount: data.volumeInfo.ratingsCount,
            language: data.volumeInfo.language,
            previewLink: data.volumeInfo.previewLink,
            infoLink: data.volumeInfo.infoLink,
          };

          setBook(bookDetail);

          // 仮のレビューデータ（実際のアプリケーションではバックエンドから取得）
          setReviews([
            {
              id: "1",
              userName: "田中太郎",
              userImage: "//ui-avatars.com/api/?name=田中太郎",
              date: "2023-05-15",
              content:
                "とても参考になりました。特に第3章の説明がわかりやすかったです。",
              rating: 4,
            },
            {
              id: "2",
              userName: "佐藤花子",
              userImage: "//ui-avatars.com/api/?name=佐藤花子",
              date: "2023-04-20",
              content:
                "初心者でも理解しやすい内容でした。実践的な例が多くて助かります。",
              rating: 5,
            },
          ]);
        }
      } catch (error) {
        console.error("本の詳細情報の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleAddReview = (data: {
    title: string;
    review: string;
    bookData?: any;
  }) => {
    console.log("レビューが投稿されました:", data);

    // 仮のレビュー追加処理（実際のアプリケーションではバックエンドに保存）
    const newReview: Review = {
      id: `${reviews.length + 1}`,
      userName: "新規ユーザー",
      userImage: "//ui-avatars.com/api/?name=新規ユーザー",
      date: new Date().toISOString().split("T")[0],
      content: data.review,
      rating: 4, // 固定値（実際のアプリではユーザー入力から取得）
    };

    setReviews([newReview, ...reviews]);
    alert("レビューが投稿されました！");
  };

  // 著者ページに遷移する関数
  const navigateToAuthor = (authorName: string) => {
    router.push(`/authors/${encodeURIComponent(authorName)}`);
  };

  // 星評価を表示するコンポーネント
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">本の情報が見つかりませんでした</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto p-6 md:p-8">
          {/* 本の詳細セクション */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 本の表紙 */}
              <div className="md:w-1/4 flex justify-center">
                <div className="w-48 h-64 overflow-hidden rounded border flex items-center justify-center bg-gray-100">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={`${book.title} の表紙`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // 画像読み込みエラー時の処理
                        console.log(`画像読み込みエラー: ${book.title}`);
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // 無限ループ防止
                        target.src = ""; // src属性をクリア
                        target.alt = "画像なし"; // 代替テキストを設定
                        target.style.display = "none"; // 画像を非表示
                        // 親要素に「画像なし」メッセージを表示
                        const parent = target.parentElement;
                        if (parent) {
                          const message = document.createElement("p");
                          message.className = "text-sm text-gray-500";
                          message.textContent = "画像なし";
                          parent.appendChild(message);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-gray-500">画像なし</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 本の情報 */}
              <div className="md:w-3/4">
                <h1 className="text-2xl font-bold mb-2">{book.title}</h1>

                {book.authors && (
                  <p className="text-gray-700 mb-4">
                    著者:{" "}
                    {book.authors.map((author, index) => (
                      <span key={author}>
                        {index > 0 && ", "}
                        <a
                          onClick={() => navigateToAuthor(author)}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          {author}
                        </a>
                      </span>
                    ))}
                  </p>
                )}

                {book.averageRating && (
                  <div className="flex items-center mb-4">
                    <StarRating rating={book.averageRating} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({book.ratingsCount || 0}件の評価)
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {book.publisher && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">出版社:</span>{" "}
                      {book.publisher}
                    </p>
                  )}
                  {book.publishedDate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">出版日:</span>{" "}
                      {book.publishedDate}
                    </p>
                  )}
                  {book.pageCount && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">ページ数:</span>{" "}
                      {book.pageCount}ページ
                    </p>
                  )}
                  {book.language && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">言語:</span>{" "}
                      {book.language === "ja" ? "日本語" : book.language}
                    </p>
                  )}
                </div>

                {book.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">概要</h2>
                    <p
                      className="text-gray-700 text-sm"
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    ></p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <ReviewForm
                    onSubmit={handleAddReview}
                    buttonText="レビューを書く"
                    buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  />

                  {book.previewLink && (
                    <a
                      href={book.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      プレビューを見る
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* レビューセクション */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">
              レビュー ({reviews.length}件)
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">
                まだレビューがありません
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6">
                    <div className="flex items-start mb-3">
                      <img
                        src={review.userImage}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{review.userName}</h3>
                          <span className="text-gray-500 text-sm ml-2">
                            {review.date}
                          </span>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-gray-700 pl-13">{review.content}</p>
                    {review.id !== reviews[reviews.length - 1].id && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
