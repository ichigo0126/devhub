"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "./ui/input";
import { ReviewForm } from "./ReviewForm";

// HTTPリンクをHTTPSに変換する関数
const secureImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // HTTP URLをHTTPSに変換
  if (url.startsWith("http:")) {
    return url.replace("http:", "https:");
  }
  return url;
};

// 本の情報の型定義
interface Book {
  id: string;
  title: string;
  authors?: string[];
  imageUrl: string;
  publishedDate?: string;
  publisher?: string;
}

export function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userIcon, setUserIcon] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Supabaseからユーザー情報を取得
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (data && data.user) {
          const user = data.user;
          console.log("認証プロバイダー:", user.app_metadata?.provider);
          console.log("ユーザーメタデータ全体:", user.user_metadata);

          // Googleプロバイダーの場合の特別処理
          if (user.app_metadata?.provider === "google") {
            // 1. identity_dataから直接画像URLを取得
            const identities = user.identities || [];
            const googleIdentity = identities.find(
              (identity) => identity.provider === "google"
            );

            if (googleIdentity && googleIdentity.identity_data) {
              console.log("Google認証データ:", googleIdentity.identity_data);

              // GoogleのOAuth情報から画像URLを正確に取得
              const pictureUrl =
                googleIdentity.identity_data.picture ||
                googleIdentity.identity_data.avatar_url;

              if (pictureUrl) {
                console.log("Googleプロフィール画像URL:", pictureUrl);
                setUserIcon(pictureUrl);
                return; // 成功したら終了
              }
            }

            // 2. user_metadataから直接取得
            if (user.user_metadata.picture) {
              console.log(
                "メタデータからの画像URL:",
                user.user_metadata.picture
              );
              setUserIcon(user.user_metadata.picture);
              return; // 成功したら終了
            }

            // 3. Googleのメールアドレスからプロフィール画像を取得する方法
            const email = user.email;
            if (email) {
              const googleId = user.user_metadata.sub || "";
              if (googleId) {
                const googlePictureUrl = `https://lh3.googleusercontent.com/a/${googleId}`;
                console.log("GoogleID画像URL:", googlePictureUrl);
                setUserIcon(googlePictureUrl);
                return;
              }
            }
          }

          // 他のプロバイダーやフォールバック
          const fallbackAvatarUrl =
            user.user_metadata.avatar_url || user.user_metadata.picture || "";

          if (fallbackAvatarUrl) {
            setUserIcon(fallbackAvatarUrl);
          } else if (user.email) {
            // 最終手段としてGravatarを使用
            setUserIcon(
              `https://www.gravatar.com/avatar/${createMD5Hash(
                user.email
              )}?d=mp`
            );
          }
        }
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
      }
    };

    // MD5ハッシュを生成する簡易関数（Gravatarで使用）
    function createMD5Hash(input: string): string {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // 32ビット整数に変換
      }
      return Math.abs(hash).toString(16);
    }

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = (data: {
    title: string;
    review: string;
    bookId?: string;
    bookImageUrl?: string;
    bookData?: Book;
  }) => {
    // 例: Supabaseにデータを保存するなど
    console.log("レビューが投稿されました:", data);

    // 選択した本の情報がある場合
    if (data.bookData) {
      console.log("選択された本の情報:", {
        id: data.bookData.id,
        title: data.bookData.title,
        authors: data.bookData.authors,
        imageUrl: data.bookData.imageUrl,
        publishedDate: data.bookData.publishedDate,
        publisher: data.bookData.publisher,
      });

      // ここでSupabaseなどに本の情報とレビューを保存する処理を追加
      // 例:
      // saveReviewToDatabase({
      //   userId: currentUser.id,
      //   bookId: data.bookData.id,
      //   bookTitle: data.bookData.title,
      //   bookAuthors: data.bookData.authors,
      //   bookImageUrl: data.bookData.imageUrl,
      //   reviewContent: data.review
      // });
    } else {
      // 本が選択されていない場合（ユーザーが直接タイトルを入力した場合）
      console.log("入力されたタイトル:", data.title);
      console.log("レビュー内容:", data.review);
    }

    // 成功時の処理
    alert("レビューが投稿されました！");
    // 必要に応じてマイページなどに遷移
    // router.push('/mypage');
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-xl font-semibold">devhub</span>
        </Link>
        <div className="flex justify-center w-full">
          <Input placeholder="本を検索" className="mx-10 w-3/4"></Input>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <ReviewForm
            onSubmit={handleAddReview}
            buttonText="レビュー作成"
            buttonClassName="text-sm font-medium bg-transparent hover:bg-gray-100 px-3 py-1.5 rounded whitespace-nowrap"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 p-0 overflow-hidden rounded-full"
              >
                {userIcon ? (
                  <img
                    src={userIcon}
                    alt="ユーザーアイコン"
                    width="32"
                    height="32"
                    className="h-full w-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    onError={(e) => {
                      console.error(
                        "プロフィール画像読み込みエラー:",
                        userIcon
                      );

                      // ユーザー情報を再取得してプロフィール画像を取得し直す
                      const retryFetchUserIcon = async () => {
                        try {
                          const { data } = await supabase.auth.getUser();
                          if (data && data.user) {
                            const user = data.user;
                            // 別の方法でURLを構築
                            if (user.user_metadata.sub) {
                              const googleId = user.user_metadata.sub;
                              const directGoogleUrl = `https://lh3.googleusercontent.com/a/${googleId}=s128-c`;
                              console.log("直接アクセスURL:", directGoogleUrl);

                              // 新しいイメージ要素で試す
                              const newImg = new Image();
                              newImg.onload = () => {
                                // 読み込み成功したらURLを更新
                                const target = e.target as HTMLImageElement;
                                target.src = directGoogleUrl;
                              };
                              newImg.onerror = () => {
                                // 最終手段: デフォルトアイコンを表示
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOCAxMGE4IDggMCAxMS0xNiAwIDggOCAwIDAxMTYgMHptLTYtM2ExIDEgMCAxMS0yIDAgMSAxIDAgMDEyIDB6bS0yIDRhMSAxIDAgMDAtMSAxdjNhMSAxIDAgMDAyIDB2LTNhMSAxIDAgMDAtMS0xeiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PC9zdmc+";
                              };
                              newImg.src = directGoogleUrl;
                            }
                          }
                        } catch (err) {
                          console.error("アイコン再取得エラー:", err);
                        }
                      };

                      // エラー処理
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // 無限ループ防止

                      // 再取得を試みる
                      retryFetchUserIcon();

                      // 一時的なフォールバックを表示
                      const parent = target.parentElement;
                      if (parent) {
                        target.style.display = "none";
                        parent.style.backgroundColor = "#4338ca";
                        parent.style.display = "flex";
                        parent.style.alignItems = "center";
                        parent.style.justifyContent = "center";

                        const fallbackIcon = document.createElement("span");
                        fallbackIcon.textContent = "G";
                        fallbackIcon.style.color = "white";
                        fallbackIcon.style.fontSize = "14px";
                        fallbackIcon.style.fontWeight = "bold";
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                ) : (
                  <span className="flex items-center justify-center h-full w-full bg-indigo-700 text-white text-xs font-bold rounded-full">
                    読み込み中...
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                いいね
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/mypage")}>
                <Settings className="mr-2 h-4 w-4" />
                設定
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoading}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? "ログアウト中..." : "ログアウト"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
