"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Check, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

type languageInfo = {
  name: string,
  bytes: number
}

type laprasDataType = {
  username: string,
  e_score: number,
  b_score: number,
  i_score: number,
  language: languageInfo[]
}

type SkillProps = {
  e_skill: number;
  b_skill: number;
  i_skill: number;
};

function HorizontalBarChart({ e_skill, b_skill, i_skill }: SkillProps) {
  const skills = [{ name: "技術力", value: e_skill, color: "bg-[#b0b0b0]" },
  { name: "ビジネス力", value: b_skill, color: "bg-[#7a7a7a]" },
  { name: "市場価値力", value: i_skill, color: "bg-[#4d4d4d]" }
  ]

  const maxValue = 5.00;
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">スキル評価</h2>

      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <div className="w-28 font-medium text-sm">{skill.name}</div>
            <div className="flex-grow relative">
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${skill.color} rounded-full transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-md`}
                  style={{ width: `${(skill.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="absolute top-0 right-0 mt-1 mr-2 text-sm font-semibold">
                {skill.value !== undefined ? skill.value.toFixed(2) : '0.00'} / {maxValue.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-500">
        各パラメータの最大値: 5.00
      </div>
    </div>
  );
}

function RaderChart({ languageInfo }: { languageInfo: languageInfo[] }) {
  const data: languageInfo[] = languageInfo

  const maxBytes = Math.max(...data.map(d => d.bytes));
  const normalizedData = data.map(d => ({
    name: d.name,
    bytes: Math.round((d.bytes / maxBytes) * 100 * 100) / 100
  }));
  console.log(normalizedData);


  // カスタムツールチップ

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">言語別レーダーチャート</h2>
      <ResponsiveContainer width="100%" height="80%">
        <RadarChart outerRadius="80%" data={normalizedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fill: '333', fontSize: 14 }} />
          <PolarRadiusAxis angle={50} domain={[0, 10]} tickCount={6} />

          <Radar
            name="現在のスキル"
            dataKey="bytes"
            stroke="#6bb2d4"
            fill="#6bb2d4"
            fillOpacity={0.6}
          />

          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
}


const ProfileCardInMypage = () => {
  const router = useRouter();
  const [isDisplayRegisterLAPRAS_URL, setIsDisplayRegisterLAPRAS_URL] =
    useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [laprasUrl, setLaprasUrl] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [laprasData, setLaprasData] = useState<laprasDataType>({
    username: "",
    e_score: 0,
    b_score: 0,
    i_score: 0,
    language: [{ name: "", bytes: 0 }]
  })

  if (!laprasData) {
    return;
  }
  useEffect(() => {
    if (isDisplayRegisterLAPRAS_URL) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isDisplayRegisterLAPRAS_URL]);

  useEffect(() => {
    const fetchUserData = async () => {
      const laprasUrlInSupabase = ""
      if (laprasUrlInSupabase) {
        setIsDisplayRegisterLAPRAS_URL(true)
        await fetch(`/api/lapras-data?userUrl=${encodeURIComponent(laprasUrlInSupabase)}`).then((res) => res.json()).then((data) => setLaprasData(data))
      }
    }
    fetchUserData()
  }, [])

  const handleSubmit = () => {
    // URLの入力があればダイアログを開く
    if (laprasUrl.trim()) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      // ここでLAPRAS URLを保存する処理を実装
      console.log("保存されたURL:", laprasUrl);
      setIsDialogOpen(false);
      setIsDisplayRegisterLAPRAS_URL(true)
      const res = await fetch(`/api/lapras-data?userUrl=${encodeURIComponent(laprasUrl)}`);
      const data = await res.json();
      console.log("fetchしたデータの中身", data);
      setLaprasData(data)

      router.push("/mypage");
    } catch (error) {
      console.error("Error during confirmation:", error);
    }
  };

  return (
    <div className="mx-auto">
      <Card className="relative mx-4 h-[200px] my-4">
        <div className="absolute top-1 right-1">
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
        </div>
        <CardHeader className="flex flex-col items-center text-center p-10">
          <Avatar className="h-16 w-16">
            <AvatarImage
              className="rounded-full"
              src="//picsum.photos/seed/a/200?grayscale&blur=2"
              alt="山田太郎"
            />
          </Avatar>
          <h2 className="text-base font-bold">山田太郎</h2>
          <div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              読書が大好きです。軸と推理小説とSF小説が好きです。
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              レビュー: 3件
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mx-4 text-center bg-gray-200">
        <CardHeader>
          <CardTitle className="text-sm">LAPRAS SCORE</CardTitle>
        </CardHeader>
        <CardContent>
          {isDisplayRegisterLAPRAS_URL ?
            <></>
            :
            <p className="text-sm text-muted-foreground">
              LAPRAS URLが設定されていません。
            </p>
          }


          {!isDisplayRegisterLAPRAS_URL && (
            <div
              className={`mt-1 transition-opacity duration-300 ease-in-out ${isVisible ? "opacity-0" : "opacity-100"
                }`}
            >
              <div className="flex pt-4">
                <Input
                  type="url"
                  placeholder="Enter your LAPRAS URL"
                  value={laprasUrl}
                  onChange={(e) => setLaprasUrl(e.target.value)}
                />
                <Button className="ml-3" variant="outline" size="icon" onClick={handleSubmit}>
                  <Check />
                </Button>
              </div>
            </div>
          )}
          {isDisplayRegisterLAPRAS_URL && (
            <div>
              <div>
                <HorizontalBarChart e_skill={laprasData.e_score} b_skill={laprasData.b_score} i_skill={laprasData.i_score} />
              </div>
              <div className="mt-7">
                <RaderChart languageInfo={laprasData.language} />
              </div>
            </div>

          )}
        </CardContent>
      </Card>

      {/* 確認用モーダルダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>LAPRAS URL確認</DialogTitle>
            <DialogDescription>
              以下のURLを登録してよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium mb-2">入力されたURL:</p>
            <p className="text-sm bg-gray-100 p-2 rounded break-all">
              {laprasUrl}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirm}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCardInMypage;
