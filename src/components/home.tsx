"use client";

import { Button } from "@/components/ui/button";
import { Header } from "./header";

interface Book {
  title: string;
  author: string;
  highlight?: boolean;
}

const mostReviewed: Book[] = [
  { title: "イクサガミ 人", author: "白藤 友惠" },
  { title: "世界でいちばん速いとおっ た物語", author: "村上 春樹" },
  { title: "六人の響きあう大学生", author: "浅倉 秋成" },
  { title: "コンビニ人間", author: "村田 沙耶香", highlight: true },
  { title: "火花", author: "又吉 直樹" },
];

const latestReleases: Book[] = [
  { title: "沈黙のパレード", author: "東野 圭吾" },
  { title: "クスノキの番人", author: "東野 圭吾" },
  { title: "夜に駆ける", author: "星野 舞夜" },
  { title: "medium 霊媒探偵城塚翡翠", author: "相沢 沙呼", highlight: true },
  { title: "ミステリーの島", author: "島川 智也" },
];

export default function Home() {
  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto p-4 bg-white font-sans">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">レビューが多い順</h2>
          <div className="grid grid-cols-5 gap-4">
            {mostReviewed.map((book, index) => (
              <div
                key={index}
                className="relative bg-white rounded shadow-sm border border-gray-200 p-2"
              >
                <div className="relative aspect-square mb-2 bg-gray-100"></div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600">{book.author}</p>
              </div>
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
          <div className="grid grid-cols-5 gap-4">
            {latestReleases.map((book, index) => (
              <div
                key={index}
                className="relative bg-white rounded shadow-sm border border-gray-200 p-2"
              >
                <div className="relative aspect-square mb-2 bg-gray-100"></div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600">{book.author}</p>
              </div>
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
    </>
  );
}