"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function Loading() {
  return (
    <div className="pl-10 overflow-hidden mr-10">
      <div className="flex justify-between items-center mt-10 mb-6">
        <div>
          <h1 className="text-2xl font-bold"></h1>
        </div>
      </div>
        <Card className="mb-4 w-full animate-pulse">
          <CardHeader className="p-4">
            <div className="">
              <div className="mb-2 flex">
                <div className="pl-4">
                  <h3 className="text-base font-semibold"></h3>
                  <span className="text-xs text-muted-foreground"></span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardDescription className="pl-4 text-sm text-foreground pb-6">

          </CardDescription>
          <Separator className="bg-gray-300 mb-3" />
        </Card>
      </div>
  );
}