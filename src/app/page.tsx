"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TypingAnimationProps {
  messages: string[];
  speed: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  messages,
  speed,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    let currentMessage = messages[currentMessageIndex];
    let timeoutId: NodeJS.Timeout;

    const typeCharacter = () => {
      if (currentIndex < currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, currentIndex + 1));
        currentIndex += 1;
        timeoutId = setTimeout(typeCharacter, speed);
      } else {
        timeoutId = setTimeout(() => {
          setCurrentMessageIndex(
            (prevIndex) => (prevIndex + 1) % messages.length
          );
          setDisplayedText("");
        }, 5000);
      }
    };

    typeCharacter();

    return () => {
      clearTimeout(timeoutId);
      setDisplayedText("");
    };
  }, [messages, speed, currentMessageIndex]);

  return <div>{displayedText}</div>;
};

export default function Page() {
  const messages = [
    "スキルレベルで選べる、エンジニアのための洞察力あふれる書評プラットフォーム",
    "技術書の深い理解を促進する、エンジニアスキル可視化型レビューサービス",
    "エンジニアの成長が見える、スキル連動型書籍レビューコミュニティ",
  ];

  return (
    <main className="flex flex-col items-center gap-20 p-20 text-base font-medium leading-6 whitespace-nowrap bg-blue-100 rounded text-black min-h-screen">
      <h1 className="font-serif font-normal text-9xl text-white pt-8 select-none">
        PAPER
      </h1>
      <div className="font-bold text-3xl">
        <TypingAnimation messages={messages} speed={100} />
      </div>
      <Link 
        href="/auth/login"
        className="px-8 py-3 text-xl font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        ログイン
      </Link>
    </main>
  );
}