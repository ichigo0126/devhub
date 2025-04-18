"use client"

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { Header } from "./header";

// Google Books APIのレスポンス型定義
interface BookVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
}

interface BookData {
  id: string;
  volumeInfo: BookVolumeInfo;
}

// レビューアイテムの型定義
interface ReviewItemProps {
  name: string;
  date: string;
  description: string;
  avatar: string;
  bookData: BookData | null;
}

// レビューの型定義
interface Review {
  name: string;
  date: string;
  description: string;
  avatar: string;
}

// Google Books APIから本の情報を取得する関数
const fetchBookInfo = async (title: string): Promise<BookData | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
        title
      )}&maxResults=1`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0] as BookData;
    }
    return null;
  } catch (error) {
    console.error("Google Books APIの取得エラー:", error);
    return null;
  }
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  name,
  date,
  description,
  avatar,
  bookData,
}) => {
  // 画像URLをHTTPSに変換する関数
  const getSecureImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    return url.replace("http://", "https://");
  };

  // 本の画像URL
  const thumbnailUrl =
    bookData && bookData.volumeInfo && bookData.volumeInfo.imageLinks
      ? getSecureImageUrl(bookData.volumeInfo.imageLinks.thumbnail)
      : null;

  // 本のタイトル
  const bookTitle =
    bookData && bookData.volumeInfo ? bookData.volumeInfo.title : name;

  return (
    <Card className="mb-4 w-full">
      <CardHeader className="p-4">
        <div className="">
          <div className="mb-2 flex">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={bookTitle}
                className="w-24 h-32 object-cover"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-500 flex items-center justify-center text-white text-xs p-1 text-center">
                画像がありません
              </div>
            )}
            <div className="pl-4">
              <h3 className="text-base font-semibold">{bookTitle}</h3>
              <span className="text-xs text-muted-foreground">{date}</span>
              {bookData &&
                bookData.volumeInfo &&
                bookData.volumeInfo.authors && (
                  <p className="text-xs text-muted-foreground mt-1">
                    著者: {bookData.volumeInfo.authors.join(", ")}
                  </p>
                )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardDescription className="pl-4 text-sm text-foreground pb-6">
        {description}
      </CardDescription>
      <Separator className="bg-gray-300 mb-3" />
    </Card>
  );
};

// Main DevHub Review Page
const MyPage: React.FC = () => {
  // 本のデータを保持するstate
  const [bookDataList, setBookDataList] = useState<(BookData | null)[]>([
    null,
    null,
    null,
  ]);

  const reviews: Review[] = [
    {
      name: "React.js&Next.js超入門第2版",
      date: "2021-02",
      description: "とても面白かった。軸と他人の視点の関係性を理解した。",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "Next.js超入門",
      date: "2023-06",
      description: "楽しい文章と感情をストーリーに紹介しました。",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "プログラマのためのDocker教科書 インフラの基礎知識&コードによる環境構築の自動化",
      date: "2015-11",
      description: "ミステリーとしても、キャラクター描写としても興味深かった。",
      avatar: "/placeholder-avatar.jpg",
    },
  ];

  // コンポーネントマウント時に本の情報を取得
  useEffect(() => {
    const fetchAllBooks = async () => {
      const bookPromises = reviews.map((review) => fetchBookInfo(review.name));
      const results = await Promise.all(bookPromises);
      setBookDataList(results);
    };

    fetchAllBooks();
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-screen max-w-7xl mx-auto p-4 flex flex-col md:flex-row">
        {/* User Profile Card */}
        <Card className="w-full md:w-1/3 mx-auto h-[240px] mb-6 md:mb-0">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src="/placeholder-avatar.jpg" alt="山田太郎" />
              <AvatarFallback>山</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-bold mb-1">山田太郎</h2>
              <p className="text-xs text-muted-foreground line-clamp-2">
                読書が大好きです。推理小説とSF小説が好きです。
              </p>
              <div className="mt-1 text-xs text-muted-foreground">
                レビュー: {reviews.length}件
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="w-full md:w-2/3 md:pl-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">レビュー一覧</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                {/* <Icons.logout className="h-4 w-4" /> */}
              </Button>
              <Button variant="outline" size="icon">
                {/* <Icons.user className="h-4 w-4" /> */}
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.map((review, index) => (
            <ReviewItem
              key={index}
              name={review.name}
              date={review.date}
              description={review.description}
              avatar={review.avatar}
              bookData={bookDataList[index]}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyPage;
