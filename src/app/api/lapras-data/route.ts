import { NextRequest } from "next/server";


function extractLanguages(data: any[]): string[] {
  return data
    .map((item) => item.languages)
    .filter((lang) => lang != null); // null や undefined を除外（任意）
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    console.log("Request URL:", url.toString());
    const userUrl = searchParams.get('userUrl');

    console.log("User URL:", userUrl);

    if (!userUrl) {
      return new Response(JSON.stringify({ error: "userUrl parameter is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("Fetching from:", userUrl);
    const response = await fetch(userUrl);

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      return new Response(JSON.stringify({
        error: `API responded with status: ${response.status}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    // console.log("Data received:", data);

    console.log("LAPRASユーザ名", data.name);
    console.log("LAPRAS_技術力", data.e_score);
    console.log("LAPRAS_ビジネス力", data.b_score);
    console.log("LAPRAS_影響力", data.i_score);

    const extractedLanguages = extractLanguages(data.github_repositories)

    // 言語ごとに集計
    const aggregateByLanguage = () => {
      const aggregated: any = {};

      // TODO: anyの型宣言
      // すべてのサブ配列を展開して言語ごとに集計
      extractedLanguages.forEach((subArray: any) => {
        subArray.forEach((item: any) => {
          if (!aggregated[item.name]) {
            aggregated[item.name] = 0;
          }
          aggregated[item.name] += item.bytes;
        });
      });

      // 集計結果を配列に変換
      return Object.keys(aggregated).map(language => ({
        name: language,
        bytes: aggregated[language]
      }));
    };

    const aggregatedData = aggregateByLanguage();

    // バイト数順に並び替え（降順）
    const sortedData = [...aggregatedData].sort((a, b) => b.bytes - a.bytes);


    console.log(sortedData);
    
   const display_lapras_data = {
      username: data.name,
      e_score: data.e_score,
      b_score: data.b_score,
      i_score: data.i_score,
      language: sortedData
    }



    return new Response(JSON.stringify(display_lapras_data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });



  } catch (err) {
    if (err instanceof Error) {
      console.error("Error in API route:", err);
      return new Response(JSON.stringify({
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error("unknown error", err);

    }
  }
}