"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function Loading() {
  return (
    <div className="mx-auto">
      <Card className="mx-4 my-9 h-[240px] rounded-lg overflow-hidden shadow animate-pulse ">
      </Card>
    </div>
  );
}
