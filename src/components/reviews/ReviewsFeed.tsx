"use client";

import type { Review } from "@/lib/types/database";
import ReviewCard from "./ReviewCard";

export default function ReviewsFeed({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12">
        <p className="text-lg text-gray-400">아직 후기가 없습니다</p>
        <p className="mt-1 text-sm text-gray-400">
          팀에 참여하고 후기를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}
    </div>
  );
}
