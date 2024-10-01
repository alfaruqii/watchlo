"use client";
import Image from "next/image";
import { marked } from "marked";
import parse from "html-react-parser";
import { formatDate } from "@/utils/formatted";
import fallbackContent from "@/utils/fallbackDesc.json"
import { useThemeStore } from "@/store/themeStore";
import { Review } from "@/types/movies.type";

// Clean and parse the review content
function cleanReviewContent(content: string | undefined) {
  const cleanContent = content?.replace(/<br\s*\/?>/gi, ""); // Remove <br> tags
  const parsedMarkdown = marked(cleanContent || fallbackContent) as string; // Convert Markdown to HTML
  return parse(parsedMarkdown); // Safely parse the HTML for React
}

function ReviewsComponent({ reviews }: { reviews: Review[] }) {
  const { theme } = useThemeStore();
  // Filter out reviews that have author details
  const filteredReviews = reviews.filter((review: Review) =>
    review.author_details.avatar_path || review.author_details.name || review.author_details.username || review.content
  );

  return (
    <div className="lg:px-72 my-10">
      <p className={`border-b ${theme === "garden" ? "border-gray-500" : "border-gray-300"} pb-1`}>Reviews</p>
      <div className="flex flex-col rounded mt-4 gap-8 py-3">
        {filteredReviews.map((review: Review, index) => (
          <div key={index} className={`border-b ${theme === "garden" ? "border-gray-300 " : "border-gray-500"} pb-4`}>
            {/* Author Details */}
            <div className="flex gap-2 mb-2 items-center">
              <div className="size-11 lg:size-12 relative rounded-full overflow-hidden">
                <Image
                  fill
                  src={review.author_details.avatar_path || "/fallback-card.webp"}
                  alt={review.author_details.name || "Avatar"}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="capitalize text-sm font-semibold line-clamp-1">
                  {review.author_details.name || review.author_details.username || "Windah Batubara"}
                </p>
                <p className="text-xs text-gray-500">{formatDate(review.updated_at)}</p>
              </div>
            </div>

            {/* Review Content */}
            <div className={`text-sm ${theme === "garden" ? "text-gray-700 " : "text-gray-300"} line-clamp-5`}>
              {cleanReviewContent(review.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsComponent;

