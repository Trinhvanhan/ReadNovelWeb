"use client";

import { useEffect, useState } from "react";
import { getNovels } from "@/lib/apis/novel.api";
import { NovelInfo } from "@/lib/apis/types/data.type";

export default function FeaturedNovelsClient({ initialData }: { initialData: NovelInfo[] }) {
  const [novels, setNovels] = useState<NovelInfo[] | null>(initialData ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // simulate revalidation or fetch new data
    setLoading(true);
    getNovels().then(res=> {
      const filtered = res.data.novels.filter(n => n.features > -1);
      setNovels(filtered);
      setLoading(false);
    });
  }, []);

  if (loading || !novels) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-muted h-[350px] rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {novels.map(novel => (
        <div key={novel.id} className="bg-background rounded shadow p-4">
          <h3 className="font-semibold">{novel.title}</h3>
          <p className="text-muted-foreground text-sm">{novel.description}</p>
        </div>
      ))}
    </div>
  );
}
