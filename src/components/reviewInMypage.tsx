"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { MessageSquare, Heart, BookOpenCheck } from "lucide-react";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const ReviewItem = ({ name, date, description, avatar }: any) => (
  <Card className="mb-4 w-full">
    <CardHeader className="p-4">
      <div className="">
        <div className="mb-2 flex">
          <img className="w-24 h-32" src={avatar} />
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



const reviews = [
  {
    id: 1,
    name: "イケウチ大人",
    date: "2023-06-02",
    description: "とても面白かった。軸と他人の視点の関係性を理解した。",
    avatar: "//ui-avatars.com/api/?name=John Smith",
  },
  {
    id: 2,
    name: "世界でいちばん満さと止った物語",
    date: "2023-06-02",
    description: "楽しい文章と感情をストーリーに紹介しました。",
    avatar: "//ui-avatars.com/api/?name=Tsuduki Shinji Smith",
  },
  {
    id: 3,
    name: "六人の等つ数大学",
    date: "2023-06-02",
    description: "ミステリーとしても、キャラクター描写としても興味深かった。",
    avatar: "//ui-avatars.com/api/?name=Utada Hikaru",
  },
  {
    id: 4,
    name: "六人の等つ数大学",
    date: "2023-06-02",
    description: "ミステリーとしても、キャラクター描写としても興味深かった。",
    avatar: "//ui-avatars.com/api/?name=Utada Hikaru",
  },
  {
    id: 5,
    name: "月と六ペンス",
    date: "2023-07-18",
    description: "芸術家の狂気と執念が生々しく描かれていて圧倒された。",
    avatar: "//ui-avatars.com/api/?name=Murakami Haruki",
  },
  {
    id: 6,
    name: "ノルウェイの森",
    date: "2023-08-09",
    description: "静かな痛みと青春のもろさが心に残る。",
    avatar: "//ui-avatars.com/api/?name=Sakamoto Ryuichi",
  },
  {
    id: 7,
    name: "博士の愛した数式",
    date: "2023-09-15",
    description: "数式と記憶のつながりが優しく、美しかった。",
    avatar: "//ui-avatars.com/api/?name=Nakamura Fumi",
  }
];

const favorites = [
  {
    id: 1,
    name: "イケウチ大人",
    date: "2023-06-02",
    description: "とても面白かった。軸と他人の視点の関係性を理解した。",
    avatar: "//ui-avatars.com/api/?name=John Smith",
  },
  {
    id: 2,
    name: "世界でいちばん満さと止った物語",
    date: "2023-06-02",
    description: "楽しい文章と感情をストーリーに紹介しました。",
    avatar: "//ui-avatars.com/api/?name=Tsuduki Shinji Smith",
  },
  {
    id: 3,
    name: "六人の等つ数大学",
    date: "2023-06-02",
    description: "ミステリーとしても、キャラクター描写としても興味深かった。",
    avatar: "//ui-avatars.com/api/?name=Utada Hikaru",
  },
];


const ReviewInMypage = async () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("reviews");
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === "likes" || tab === "reviews") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`?tab=${value}`)
  }
  return (
    <div className="pl-10 mr-10 ">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsContent value="reviews" className="mt-0">
          <div className="mb-4">
            <h2 className="text-xl font-bold">書籍レビュー</h2>
            <p className="text-sm text-gray-500">{reviews.length}件のレビュー</p>
          </div>
          <div>
            {reviews.map(review => (
              <ReviewItem
                key={review.id}
                name={review.name}
                date={review.date}
                description={review.description}
                avatar={review.avatar}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <div className="flex justify-between">
            <div className="mb-4">
              <h2 className="text-xl font-bold">いいね</h2>
              <p className="text-sm text-gray-500">{favorites.length}件のいいね</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <MessageSquare />
              </Button>
              <Button variant="outline" size="icon">
                <BookOpenCheck />
              </Button>
            </div>
          </div>
          <div>
            {favorites.map(item => (
              <ReviewItem
                key={item.id}
                name={item.name}
                date={item.date}
                description={item.description}
                avatar={item.avatar}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewInMypage;
