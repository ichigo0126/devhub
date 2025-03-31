"use client";

import React, { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

const ReviewItem = ({ name, date, description, avatar }: any) => (
  <Card className="mb-4 w-full">
    <CardHeader className="p-4">
      <div className="">
        <div className="mb-2 flex">
          <div className="w-24 h-32 bg-gray-500"></div>
          <div className="pl-4">
            <h3 className="text-base font-semibold">{name}</h3>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardDescription className="pl-4 text-sm text-foreground pb-6">
      {/* <p className="pl-4 text-sm text-foreground pb-10"> */}
      {description}
      {/* </p> */}
    </CardDescription>
    <Separator className="bg-gray-300 mb-3" />
  </Card>
);

// Main DevHub Review Page
const MyPage = () => {
  const reviews = [
    {
      name: "イケウチ大人",
      date: "2023-06-02",
      description: "とても面白かった。軸と他人の視点の関係性を理解した。",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "世界でいちばん満さと止った物語",
      date: "2023-06-02",
      description: "楽しい文章と感情をストーリーに紹介しました。",
      avatar: "/placeholder-avatar.jpg",
    },
    {
      name: "六人の等つ数大学",
      date: "2023-06-02",
      description: "ミステリーとしても、キャラクター描写としても興味深かった。",
      avatar: "/placeholder-avatar.jpg",
    },
  ];
  const [userIcon, setUserIcon] = useState("");
  const [userName, setUserName] = useState("");
  const [userBio, setUserBio] = useState(
    "読書が大好きです。軸と推理小説とSF小説が好きです。"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserIcon(user.user_metadata.avatar_url);
          setUserName(user.user_metadata.full_name);

          // ユーザーのプロフィール情報を取得
          const { data, error } = await supabase
            .from("profiles")
            .select("bio")
            .eq("id", user.id)
            .single();

          if (data && data.bio) {
            setUserBio(data.bio);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // 編集をキャンセル
      setIsEditing(false);
    } else {
      // 編集モードに入る
      setEditedBio(userBio);
      setIsEditing(true);
    }
  };

  const handleSaveBio = async () => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("ユーザーが見つかりません");

      // プロフィール情報を更新
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        bio: editedBio,
        updated_at: new Date(),
      });

      if (error) throw error;

      // 更新成功
      setUserBio(editedBio);
      setIsEditing(false);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 残りの既存コード...

  return (
    <>
      <Header />

      <div className="bg-gray-100">
        <div className="min-h-screen max-w-7xl mx-auto p-4 flex">
          {/* User Profile Card */}
          <Card className="w-1/3 mx-auto h-[240px]">
            <CardHeader className="flex flex-col items-center text-center">
              {userIcon ? (
                <img
                  src={userIcon}
                  alt="User"
                  className="h-16 w-16 rounded-full mb-2"
                />
              ) : (
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="山田太郎" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              )}

              <div>
                <h2 className="text-base font-bold mb-3">{userName}</h2>

                {isEditing ? (
                  <div className="mt-2">
                    <Textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      placeholder="自己紹介を入力してください"
                      className="min-h-[80px] text-sm"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleEditToggle}
                        disabled={isLoading}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={handleSaveBio}
                        disabled={isLoading}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {userBio}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-7 w-7"
                        onClick={handleEditToggle}
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      レビュー: 3件
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
          </Card>

          <div className="w-2/3 pl-10">
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
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
