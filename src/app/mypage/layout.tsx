import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  profileCardPart,
  reviewPart,
}: Readonly<{
  profileCardPart: React.ReactNode;
  reviewPart: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 overflow-y-auto">
          {profileCardPart}
        </div>
        <Separator orientation="vertical" className="h-auto self-stretch" />
        <div className="w-2/3 overflow-y-auto">
          {reviewPart}
        </div>
      </div>
    </div>
  );
}