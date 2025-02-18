"use client";

import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
    useEffect(() => {
        const googleAccountURL = 'https://accounts.google.com/signup';
        
        const timer = setTimeout(() => {
            window.location.href = googleAccountURL;
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <Alert className="max-w-md">
                <AlertDescription className="text-center">
                    <p className="mb-4 text-lg">Googleアカウント作成ページへ移動しています...</p>
                    <p className="text-sm text-gray-600">自動的に移動しない場合は、
                        <a 
                            href="https://accounts.google.com/signup"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            こちら
                        </a>
                        をクリックしてください。
                    </p>
                </AlertDescription>
            </Alert>
        </div>
    );
}