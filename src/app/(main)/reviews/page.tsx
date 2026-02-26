"use client";

import { useUser } from "@/hooks/useUser";
import { useRealtimeReviews } from "@/hooks/useRealtimeReviews";
import ReviewsFeed from "@/components/reviews/ReviewsFeed";
import SubmitReviewForm from "@/components/reviews/SubmitReviewForm";

export default function ReviewsPage() {
  const { profile } = useUser();
  const { reviews, loading, submitReview } = useRealtimeReviews();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">후기 피드</h2>
          <p className="mt-1 text-sm text-gray-500">
            팀별 해커톤 후기를 확인하세요
          </p>
        </div>

        {profile?.team_id ? (
          <div className="mb-6">
            <SubmitReviewForm
              teamId={profile.team_id}
              onSubmit={submitReview}
            />
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
            <p className="text-sm font-medium text-amber-800">
              후기를 작성하려면 팀에 먼저 참여해주세요
            </p>
            <a
              href="/teams"
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              팀 결성하기
            </a>
          </div>
        )}

        <ReviewsFeed reviews={reviews} />
      </div>
    </div>
  );
}
