"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Check, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const ProfileCard_in_mypage = () => {
  const router = useRouter();
  const [isDisplayRegisterLAPRAS_URL, setIsDisplayRegisterLAPRAS_URL] =
    useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [laprasUrl, setLaprasUrl] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDisplayRegisterLAPRAS_URL) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isDisplayRegisterLAPRAS_URL]);

  const handleSubmit = () => {
    // URLの入力があればダイアログを開く
    if (laprasUrl.trim()) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    try {
      // ここでLAPRAS URLを保存する処理を実装
      console.log("保存されたURL:", laprasUrl);
      setIsDialogOpen(false);
      // 必要に応じて入力フォームを閉じる
      setIsDisplayRegisterLAPRAS_URL(false);

      router.push("/mypage");
    } catch (error) {
      console.error("Error during confirmation:", error);
    }
  };

  return (
    <div className="mx-auto">
      <Card className="relative mx-4 h-[200px] my-4">
        <div className="absolute top-1 right-1">
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
        </div>
        <CardHeader className="flex flex-col items-center text-center p-10">
          <Avatar className="h-16 w-16">
            <AvatarImage
              className="rounded-full"
              src="//picsum.photos/seed/a/200?grayscale&blur=2"
              alt="山田太郎"
            />
          </Avatar>
          <h2 className="text-base font-bold">山田太郎</h2>
          <div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              読書が大好きです。軸と推理小説とSF小説が好きです。
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              レビュー: 3件
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mx-4 text-center bg-gray-200">
        <CardHeader>
          <CardTitle className="text-sm">LAPRAS SCORE</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            LAPRAS URLが設定されていません。
          </p>
          <Button
            variant="ghost"
            onClick={() => setIsDisplayRegisterLAPRAS_URL((pre) => !pre)}
          >
            設定する
          </Button>
          {isDisplayRegisterLAPRAS_URL && (
            <div
              className={`mt-1 transition-opacity duration-300 ease-in-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex">
                <Input
                  type="url"
                  placeholder="Enter your LAPRAS URL"
                  value={laprasUrl}
                  onChange={(e) => setLaprasUrl(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={handleSubmit}>
                  <Check />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 確認用モーダルダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>LAPRAS URL確認</DialogTitle>
            <DialogDescription>
              以下のURLを登録してよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium mb-2">入力されたURL:</p>
            <p className="text-sm bg-gray-100 p-2 rounded break-all">
              {laprasUrl}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirm}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCard_in_mypage;
