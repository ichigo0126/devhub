"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

// 文字列の完全一致を確認する関数（大文字小文字を無視し、空白を正規化）
const normalizedMatch = (
  str1: string | undefined,
  str2: string | undefined
): boolean => {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

// 本の型定義
interface BookItem {
  id: string;
  title: string;
  description?: string;
  publishedDate?: string;
  imageUrl?: string;
  publisher?: string;
}

export default function AuthorPage() {
  const params = useParams();
  const router = useRouter();
  const authorName = decodeURIComponent(params.name as string);

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

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
    const fetchAuthorBooks = async () => {
      try {
        setLoading(true);
        // Google Books APIから著者の本を検索
        const query = encodeURIComponent(`inauthor:"${authorName}"`);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          // 著者名が完全に一致する本だけをフィルタリング
          const exactMatchBooks = data.items.filter((item: any) => {
            // 著者情報がない場合はスキップ
            if (
              !item.volumeInfo.authors ||
              item.volumeInfo.authors.length === 0
            ) {
              return false;
            }

            // 完全一致する著者名があるかチェック
            return item.volumeInfo.authors.some((author: string) =>
              normalizedMatch(author, authorName)
            );
          });

          console.log(
            `著者「${authorName}」で検索: 全${data.items.length}件中、完全一致は${exactMatchBooks.length}件`
          );

          // 完全一致の件数を設定
          setTotalItems(exactMatchBooks.length);

          const bookList = exactMatchBooks.map((item: any) => {
            // 画像URLを安全に取得（存在しない場合はundefined）
            let imageUrl;
            if (item.volumeInfo.imageLinks) {
              // thumbnail優先、なければsmallThumbnail、どちらもなければundefined
              imageUrl = secureImageUrl(
                item.volumeInfo.imageLinks.thumbnail ||
                  item.volumeInfo.imageLinks.smallThumbnail
              );
            }

            return {
              id: item.id,
              title: item.volumeInfo.title,
              description: item.volumeInfo.description,
              publishedDate: item.volumeInfo.publishedDate,
              imageUrl: imageUrl,
              publisher: item.volumeInfo.publisher,
            };
          });

          setBooks(bookList);
        } else {
          setBooks([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("著者の本の取得に失敗しました:", error);
        setBooks([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    if (authorName) {
      fetchAuthorBooks();
    }
  }, [authorName]);

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
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

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto p-6 md:p-8">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{authorName}</h1>
              <p className="text-gray-600">
                {totalItems} 件の本が見つかりました
              </p>
            </div>

            {books.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  この著者の本は見つかりませんでした
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleBookClick(book.id)}
                  >
                    <div className="h-48 overflow-hidden bg-gray-100 flex justify-center items-center">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="h-full object-contain" // object-coverからobject-containに変更
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
                    <div className="p-4">
                      <h3 className="font-medium text-md mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      {book.publishedDate && (
                        <p className="text-sm text-gray-600 mb-1">
                          出版日: {book.publishedDate}
                        </p>
                      )}
                      {book.publisher && (
                        <p className="text-sm text-gray-600">
                          出版社: {book.publisher}
                        </p>
                      )}
                    </div>
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
