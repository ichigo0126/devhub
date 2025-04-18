"use client";

import { Button } from "@/components/ui/button";
import { Header } from "./header";
import { useEffect, useState } from "react";

interface Book {
  title: string;
  author: string;
}

const mostReviewed: Book[] = [
  { title: "ハイパフォーマンス ブラウザネットワーキング ―ネットワークアプリケーションのためのパフォーマンス最適化", author: "和田 祐一郎" },
  { title: "達人に学ぶDB設計徹底指南書 第2版", author: "ミック" },
  { title: "Web API: The Good Parts", author: "水野 貴明" },
  { title: "プロを目指す人のためのTypeScript入門 安全なコードの書き方から高度な型の使い方まで (Software Design plus)", author: "鈴木 僚太" },
  { title: "ゼロから作るDeep Learning ―Pythonで学ぶディープラーニングの理論と実装", author: "斎藤 康毅" },
];

const latestReleases: Book[] = [
  { title: "AIエディタCursor完全ガイド", author: "木下雄一朗" },
  { title: "UIデザインのアイデア帳", author: "東影勇太" },
  { title: "Webプロフェッショナルプログラミング React", author: "西畑一馬" },
  { title: "React.js&Next.js超入門第2版", author: "掌田津耶乃" },
  { title: "これからはじめるReact実践入門", author: "山田祥寛" },
];

const BookCard = ({ book, index }: { book: Book; index: number }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookCover = async () => {
      try {
        const query = encodeURIComponent(`${book.title} ${book.author}`);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
        );
        const data = await response.json();

        // 検索結果がある場合、最初の本の表紙画像URLを設定
        if (
          data.items &&
          data.items.length > 0 &&
          data.items[0].volumeInfo.imageLinks
        ) {
          // 高解像度の画像を取得
          const coverUrl =
            data.items[0].volumeInfo.imageLinks.thumbnail ||
            data.items[0].volumeInfo.imageLinks.smallThumbnail;
          setImageUrl(coverUrl);
        } else {
          // 画像が見つからない場合はプレースホルダーを使用
          setImageUrl(
            `/api/placeholder/300/400?text=${encodeURIComponent(
              book.title.substring(0, 10)
            )}`
          );
        }
      } catch (error) {
        console.error("本の表紙を取得できませんでした:", error);
        // エラーの場合もプレースホルダーを使用
        setImageUrl(
          `/api/placeholder/300/400?text=${encodeURIComponent(
            book.title.substring(0, 10)
          )}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookCover();
  }, [book.title, book.author]);

  return (
    <div
      className={`relative bg-white rounded shadow-sm border p-2 transition-all hover:shadow-md`}
    >
      <div className="relative aspect-square mb-2 bg-gray-100 overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-xs text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${book.title} の表紙`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-medium text-sm line-clamp-2 mb-1">{book.title}</h3>
      <p className="text-xs text-gray-600">{book.author}</p>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <div className="max-w-[1200px] mx-auto p-4 font-sans">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">レビューが多い順</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mostReviewed.map((book, index) => (
                <BookCard key={index} book={book} index={index} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300"
              >
                もっと見る
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">本の発売日が新しい順</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {latestReleases.map((book, index) => (
                <BookCard
                  key={index}
                  book={book}
                  index={index + mostReviewed.length}
                />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300"
              >
                もっと見る
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
