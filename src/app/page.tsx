"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">devhub</h1>
          <Button onClick={handleLogout} disabled={isLoading} variant="outline">
            {isLoading ? "ログアウト中..." : "ログアウト"}
          </Button>
        </div>

        {user && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">名前:</span>
                  <span className="text-black">
                    {user.user_metadata?.full_name || "未設定"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-black">
                    メールアドレス:
                  </span>
                  <span className="font-semibold text-black">{user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
