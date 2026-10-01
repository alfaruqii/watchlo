"use client";
import { useState } from "react";
import Image from "next/image";
import { marked } from "marked";
import parse from "html-react-parser";
import { MessageSquareQuote } from "lucide-react";
import { formatDate } from "@/utils/formatted";
import fallbackContent from "@/utils/fallbackDesc.json";
import { Review } from "@/types/movies.type";

function cleanReviewContent(content: string | undefined) {
  const raw = content || (typeof fallbackContent === "string" ? fallbackContent : "");
  const cleanContent = raw
    ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    ?.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    ?.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    ?.replace(/<br\s*\/?>/gi, "");
  const parsedMarkdown = marked.parse(cleanContent, { async: false }) as string;
  return parse(parsedMarkdown);
}

function ReviewsComponent({ reviews }: { reviews: Review[] }) {
  const [isImageLoading, setImageLoading] = useState<boolean>(true);

  const filteredReviews = reviews.filter(
    (review: Review) =>
      review.author_details.avatar_path ||
      review.author_details.name ||
      review.author_details.username ||
      review.content
  );

  return (
    <section className="my-10 rounded-sm border border-hairline bg-surface-1 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-3">
        <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
          <MessageSquareQuote className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
          <span>Critical Reception &amp; Notes</span>
        </h2>
        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
          {filteredReviews.length} REVIEWS
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredReviews.map((review: Review, index) => (
          <article
            key={review.id ?? index}
            className="flex flex-col justify-between rounded-sm border border-hairline bg-surface-2/60 p-4"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-hairline/70 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-10 overflow-hidden rounded-sm border border-hairline bg-surface-3">
                    <Image
                      unoptimized
                      fill
                      src={
                        (review.author_details.avatar_path &&
                          review.author_details.avatar_path.trim()) ||
                        "/fallback-card.webp"
                      }
                      alt={review.author_details.name || "Avatar"}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      className={`object-cover transition-custom-blur ${
                        isImageLoading
                          ? "scale-110 blur-2xl"
                          : "scale-100 blur-0"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="line-clamp-1 font-display text-sm font-bold capitalize text-foreground">
                      {review.author_details.name ||
                        review.author_details.username ||
                        "Archival Critic"}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {formatDate(review.updated_at)}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-gold tabular-nums">
                  NOTE #{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="line-clamp-5 max-w-[65ch] text-sm leading-relaxed text-foreground/85">
                {cleanReviewContent(review.content)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewsComponent;
