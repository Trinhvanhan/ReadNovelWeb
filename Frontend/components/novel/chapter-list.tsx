"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ChapterInfo } from "@/lib/apis/types/data.type";
interface ChapterListProps {
    chapters: ChapterInfo[],
    novelId: string
}
export default function ChapterList({ chapters, novelId } : ChapterListProps) {
  const [showAll, setShowAll] = useState(false);

  // Lấy 5 chương đầu và cuối nếu chưa mở rộng
  const displayChapters = showAll
    ? chapters
    : [...chapters.slice(0, 5)];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Chapters</h2>
      <Card>
        <CardContent className="p-0">
          {displayChapters.map((chapter, index) => (
            <div key={chapter.number}>
              <Link href={`/read/${novelId}/${chapter.number}`}>
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Chapter {chapter.number}: {chapter.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{new Date(chapter.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              {index < displayChapters.length - 1 && <Separator />}
            </div>
          ))}

          {!showAll && chapters.length > 10 && (
            <div className="p-4 flex justify-center">
              <Button onClick={() => setShowAll(true)} variant="outline">
                View all ({chapters.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
