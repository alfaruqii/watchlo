"use client";
import { useState } from "react";
import Image from "next/image";
import { marked } from "marked";
import parse from "html-react-parser";
import { formatDate } from "@/utils/formatted";
import fallbackContent from "@/utils/fallbackDesc.json";
import { useThemeStore } from "@/store/themeStore";
import { Review } from "@/types/movies.type";

// Clean and parse the review content
function cleanReviewContent(content: string | undefined) {
  const cleanContent = content?.replace(/<br\s*\/?>/gi, ""); // Remove <br> tags
  const parsedMarkdown = marked(cleanContent || fallbackContent) as string; // Convert Markdown to HTML
  return parse(parsedMarkdown); // Safely parse the HTML for React
}

function ReviewsComponent({ reviews }: { reviews: Review[] }) {
  const [isImageLoading, setImageLoading] = useState<boolean>(true);
  const { theme } = useThemeStore();
  // Filter out reviews that have author details
  const filteredReviews = reviews.filter(
    (review: Review) =>
      review.author_details.avatar_path ||
      review.author_details.name ||
      review.author_details.username ||
      review.content
  );

  return (
    <div className="my-10 lg:px-72">
      <p
        className={`${
          theme === "garden" ? "border-gray-500" : "border-gray-300"
        }
        border-b pb-1`}
      >
        Reviews
      </p>
      <div className="mt-4 flex flex-col gap-8 rounded py-3">
        {filteredReviews.map((review: Review, index) => (
          <div
            key={index}
            className={`${
              theme === "garden" ? "border-gray-300 " : "border-gray-500"
            }
            border-b pb-4`}
          >
            {/* Author Details */}
            <div className="mb-2 flex items-center gap-2">
              <div className="relative size-11 overflow-hidden rounded-full lg:size-12">
                <Image
                  unoptimized
                  fill
                  src={
                    review.author_details.avatar_path || "/fallback-card.webp"
                  }
                  alt={review.author_details.name || "Avatar"}
                  onLoad={() => setImageLoading(false)}
                  className={`object-cover transition-custom-blur  ${
                    isImageLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
                  }
                  object-cover`}
                />
              </div>
              <div>
                <p className="line-clamp-1 text-sm font-semibold capitalize">
                  {review.author_details.name ||
                    review.author_details.username ||
                    "Windah Batubara"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(review.updated_at)}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div
              className={`${
                theme === "garden" ? "text-gray-700 " : "text-gray-300"
              }
              line-clamp-5 text-sm`}
            >
              {cleanReviewContent(review.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsComponent;
