import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  test1,
  test2,
}: Readonly<{
  test1: React.ReactNode;
  test2: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 overflow-y-auto">
          {test1}
        </div>
        <Separator orientation="vertical" className="h-auto self-stretch" />
        <div className="w-2/3 overflow-y-auto">
          {test2}
        </div>
      </div>
    </div>
  );
}