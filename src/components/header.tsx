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

export function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userIcon, setUserIcon] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserIcon(user.user_metadata.avatar_url);
          console.log(user.user_metadata.avatar_url);
          console.log("Complete user object:", user);
        }
      } catch (error) {
        console.log(error);
      }
    };
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

  const handleAddReview = (data: { title: string; review: string }) => {
    // 例: Supabaseにデータを保存するなど
    console.log("レビューが投稿されました:", data);
    // 成功した場合はユーザーに通知するか、マイページなどに遷移させることも可能
  };

  console.log(userIcon);

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
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full w-full">
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
