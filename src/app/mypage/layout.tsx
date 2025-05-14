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
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden mx-auto w-11/12 md:w-5/6">
        <div className="w-full md:w-1/3 overflow-y-auto mb-4 md:mb-0">
          {profileCardPart}
        </div>
        <Separator orientation="horizontal" className="md:hidden mb-4" />
        <Separator orientation="vertical" className="hidden md:block h-auto self-stretch" />
        <div className="w-full md:w-2/3 overflow-y-auto">
          {reviewPart}
        </div>
      </div>
    </div>
  );
}