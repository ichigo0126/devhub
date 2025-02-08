import React from "react";
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

// Review Item Component

// TODO: 型を定義
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

  return (
    <>
      <Header />

      <div className="min-h-screen max-w-7xl mx-auto p-4 flex">
        {/* User Profile Card */}
        <Card className="w-1/3 mx-auto h-[240px]">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src="/placeholder-avatar.jpg" alt="山田太郎" />
              <AvatarFallback>山</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-bold mb-1">山田太郎</h2>
              <p className="text-xs text-muted-foreground line-clamp-2">
                読書が大好きです。軸と推理小説とSF小説が好きです。
              </p>
              <div className="mt-1 text-xs text-muted-foreground">
                レビュー: 3件
              </div>
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
    </>
  );
};

export default MyPage;
