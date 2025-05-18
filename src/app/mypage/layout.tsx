"use client"

import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { MessageSquare, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  profileCardPart,
  reviewPart,
}: Readonly<{
  profileCardPart: React.ReactNode;
  reviewPart: React.ReactNode;
}>) {
  const router = useRouter()
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden mx-auto w-11/12 md:w-5/6">
        <div className="w-full md:w-1/3 overflow-y-auto mb-4 md:mb-0">
          {profileCardPart}
        </div>
        <Separator orientation="horizontal" className="md:hidden mb-4" />
        <Separator orientation="vertical" className="hidden md:block h-auto self-stretch" />
        <div className="w-full">
          <Tabs className="pt-5 w-full fixed bg-white">
            <div className="border-b border-gray-200">
              <TabsList className="flex w-1/2 mb-0 bg-transparent gap-1 p-1">
                <TabsTrigger
                  value="reviews"
                  className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#4d4d4d] data-[state=active]:text-[#292929] data-[state=active]:bg-white rounded-none  hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('?tab=reviews')}
                >
                  <MessageSquare size={18} className="mr-2" />
                  レビュー
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#4d4d4d] data-[state=active]:text-[#292929] data-[state=active]:bg-white rounded-none  hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('?tab=likes')}
                >
                  <Heart size={18} className="mr-2" />
                  いいね
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          <div className="w-full mt-32 h-[calc(100vh-15rem)] overflow-y-auto border-1">
            {reviewPart}
          </div>
        </div>
      </div>
    </div>
  );
}