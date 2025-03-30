"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-xl font-semibold">devhub</span>
        </Link>
        <Input placeholder="本を検索" className="mx-10"></Input>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="sm">
            レビューを新規作成
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                  山田太郎
                </div>
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
