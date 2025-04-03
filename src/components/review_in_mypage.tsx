import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

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
    name: "イケウチ大人",
    date: "2023-06-02",
    description: "とても面白かった。軸と他人の視点の関係性を理解した。",
    avatar: "//ui-avatars.com/api/?name=John Smith",
  },
  {
    name: "世界でいちばん満さと止った物語",
    date: "2023-06-02",
    description: "楽しい文章と感情をストーリーに紹介しました。",
    avatar: "//ui-avatars.com/api/?name=Tsuduki Shinji Smith",
  },
  {
    name: "六人の等つ数大学",
    date: "2023-06-02",
    description: "ミステリーとしても、キャラクター描写としても興味深かった。",
    avatar: "//ui-avatars.com/api/?name=Utada Hikaru",
  },
];

const Review_in_mypage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <div className="pl-10 mr-10">
      <div className="flex justify-between items-center mt-10 mb-6">
        <div>
          <h1 className="text-2xl font-bold">レビュー</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            {/* <Icons.logout className="h-4 w-4" /> */}
          </Button>
          <Button variant="outline" size="icon">
            {/* <Icons.user className="h-4 w-4" /> */}
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
  );
};

export default Review_in_mypage;
