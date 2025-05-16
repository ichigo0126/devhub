"use client";

import { Button } from "@/components/ui/button";
import { Header } from "./header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  title: string;
  author: string;
}

const mostReviewed: Book[] = [
  {
    title:
      "ハイパフォーマンス ブラウザネットワーキング ―ネットワークアプリケーションのためのパフォーマンス最適化",
    author: "和田 祐一郎",
  },
  { title: "達人に学ぶDB設計徹底指南書 第2版", author: "ミック" },
  { title: "Web API: The Good Parts", author: "水野 貴明" },
  {
    title:
      "プロを目指す人のためのTypeScript入門 安全なコードの書き方から高度な型の使い方まで (Software Design plus)",
    author: "鈴木 僚太",
  },
  {
    title:
      "ゼロから作るDeep Learning ―Pythonで学ぶディープラーニングの理論と実装",
    author: "斎藤 康毅",
  },
];

const latestReleases: Book[] = [
  { title: "AIエディタCursor完全ガイド", author: "木下雄一朗" },
  { title: "UIデザインのアイデア帳", author: "東影勇太" },
  {
    title: "Web制作の現場で使う jQueryデザイン入門［改訂新版]",
    author: "西畑一馬",
  },
  { title: "React.js&Next.js超入門第2版", author: "掌田津耶乃" },
  { title: "Azure OpenAIプログラミング入門", author: "掌田津耶乃" },
];

// HTTPリンクをHTTPSに変換する関数
const secureImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // HTTP URLをHTTPSに変換
  if (url.startsWith("http:")) {
    return url.replace("http:", "https:");
  }
  return url;
};

// 文字列の一致を確認する関数（大文字小文字を無視し、空白を正規化）
const normalizedMatch = (
  str1: string | undefined,
  str2: string | undefined
): boolean => {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

const BookCard = ({ book, index }: { book: Book; index: number }) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookId, setBookId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Bookデータを取得する関数を切り出す
  const fetchBookData = async (retryCount = 0) => {
    try {
      // リトライ時はローディング状態に戻す
      if (retryCount > 0) {
        setLoading(true);
        setImageError(false);
      }

      // より正確な検索のために著者名を引用符で囲む
      const titleQuery = encodeURIComponent(`"${book.title}"`);
      const authorQuery = encodeURIComponent(`inauthor:"${book.author}"`);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${titleQuery} ${authorQuery}&maxResults=5`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // 検索結果がある場合
      if (data.items && data.items.length > 0) {
        // 著者名が完全に一致する本をフィルタリング
        const matchingBooks = data.items.filter((item: any) => {
          // 著者の配列がない場合はスキップ
          if (!item.volumeInfo.authors || !item.volumeInfo.authors.length) {
            return false;
          }

          // タイトルが部分的に一致するか確認
          const titleMatches =
            item.volumeInfo.title &&
            (item.volumeInfo.title
              .toLowerCase()
              .includes(book.title.toLowerCase()) ||
              book.title
                .toLowerCase()
                .includes(item.volumeInfo.title.toLowerCase()));

          // 著者名が一致するか確認
          const authorMatches = item.volumeInfo.authors.some((author: string) =>
            normalizedMatch(author, book.author)
          );

          return titleMatches && authorMatches;
        });

        if (matchingBooks.length > 0) {
          // 最も適切な一致を使用
          const bestMatch = matchingBooks[0];

          // IDを確実に保存
          if (bestMatch.id) {
            setBookId(bestMatch.id);
          } else {
            throw new Error("Book ID not found in API response");
          }

          // 画像URLを設定
          if (bestMatch.volumeInfo.imageLinks) {
            // 高解像度の画像を取得し、HTTPSに変換
            const coverUrl = secureImageUrl(
              bestMatch.volumeInfo.imageLinks.thumbnail ||
                bestMatch.volumeInfo.imageLinks.smallThumbnail
            );

            if (coverUrl) {
              setImageUrl(coverUrl);
            } else {
              setImageError(true);
            }
          } else {
            // 画像が見つからない場合はエラーフラグをセット
            setImageError(true);
          }
        } else {
          // フィルタリング後に一致する本がない場合
          console.log(
            `完全に一致する本が見つかりません: ${book.title} by ${book.author}`
          );

          // 最初の検索結果を使用（フォールバック）
          const firstBook = data.items[0];
          setBookId(firstBook.id);

          if (firstBook.volumeInfo.imageLinks) {
            const coverUrl = secureImageUrl(
              firstBook.volumeInfo.imageLinks.thumbnail ||
                firstBook.volumeInfo.imageLinks.smallThumbnail
            );

            if (coverUrl) {
              setImageUrl(coverUrl);
            } else {
              setImageError(true);
            }
          } else {
            setImageError(true);
          }
        }
      } else {
        // 検索結果がない場合もエラーフラグをセット
        setImageError(true);
        console.log(`検索結果なし: ${book.title} by ${book.author}`);
      }
    } catch (error) {
      // エラーログを抑制（開発中のみ表示するように条件分岐を追加）
      if (process.env.NODE_ENV === "development" && false) {
        // falseを追加して強制的に非表示
        console.error(
          `本の情報取得エラー (${book.title} by ${book.author}):`,
          error
        );
      }
      // エラーの場合もエラーフラグをセット
      setImageError(true);

      // 3回までリトライ
      if (retryCount < 3) {
        // リトライログも抑制
        if (process.env.NODE_ENV === "development" && false) {
          console.log(`リトライ (${retryCount + 1}/3): ${book.title}`);
        }
        setTimeout(
          () => fetchBookData(retryCount + 1),
          1000 * (retryCount + 1)
        );
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, [book.title, book.author]);

  const handleBookClick = () => {
    if (bookId) {
      router.push(`/books/${bookId}`);
    } else {
      // IDが取得できていない場合、再取得を試みる
      if (process.env.NODE_ENV === "development" && false) {
        console.log("本のIDが見つかりません。再取得を試みます。");
      }
      setIsRetrying(true);
      fetchBookData();

      // ユーザーに通知
      alert(
        "申し訳ありません。この本の情報を読み込めませんでした。もう一度お試しください。"
      );
    }
  };

  return (
    <div
      className={`relative bg-white rounded shadow-sm border p-2 transition-all hover:shadow-md cursor-pointer`}
      onClick={handleBookClick}
    >
      <div className="relative aspect-square mb-2 bg-gray-100 overflow-hidden flex items-center justify-center">
        {loading || isRetrying ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-xs text-gray-500">読み込み中...</p>
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-gray-500">画像なし</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${book.title} の表紙`}
            className="w-full h-full object-contain"
            onError={(e) => {
              if (process.env.NODE_ENV === "development" && false) {
                console.log(`画像読み込みエラー: ${book.title}`);
              }
              setImageError(true);
              (e.target as HTMLImageElement).style.display = "none";
            }}
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
