import Answer from "@/components/docs/Answer";
import Question from "@/components/docs/Question";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const linkClassName =
  "font-semibold text-gold underline underline-offset-4 transition-opacity hover:opacity-80";

function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-8 border-b border-hairline pb-5">
        <h1 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          <BookOpen className="size-6 text-gold" strokeWidth={1.75} />
          <span>Screening Notes &amp; Technical FAQ</span>
        </h1>
        <p className="mt-2 max-w-[65ch] text-sm text-muted-foreground sm:text-base">
          Essential configuration notes for DNS resolution, subtitles, and
          ad-free third-party playback in the Watchlo Screening Room.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question text={`"Why did you create this?"`} />
          <Answer text="So that if there is a film or series you want to watch without giving financial support to its production entities, you can watch it freely here." />
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question text={`"Why do I get an error when loading subtitles?"`} />
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            This usually happens when your internet provider blocks third-party subtitle hosts. Switching your connection to an open DNS resolver like Google DNS or Cloudflare fixes the issue. Follow the setup guide for{" "}
            <Link
              href="https://www.geeksforgeeks.org/how-to-enable-or-disable-dns-in-google-chrome-browser/"
              className={linkClassName}
            >
              Desktop / Android Chrome
            </Link>{" "}
            or{" "}
            <Link
              href="https://geekdon.com/google-dns-ios"
              className={linkClassName}
            >
              iOS
            </Link>
            .
          </p>
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question text={`"Why are subtitles missing on some titles?"`} />
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            Some upstream video streams do not bundle subtitle tracks. When that happens, you can find subtitle files on community repositories like{" "}
            <Link href="https://subdl.com" className={linkClassName}>
              Subdl
            </Link>{" "}
            or{" "}
            <Link
              href="https://www.opensubtitles.org/id"
              className={linkClassName}
            >
              OpenSubtitles
            </Link>
            .
          </p>
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question
            text={`"Why are there ads when playing video?"`}
          />
          <Answer text="External streaming hosts insert those ads. Watchlo itself contains zero ads and generates no revenue. If you use a browser with ad filtering or install an extension, you will not see them." />
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question
            text={`"Which browsers and ad blockers do you recommend?"`}
          />
          <Answer text="Brave works reliably on both desktop and mobile because its Shields feature blocks popups by default. On Chrome or Firefox, installing uBlock Origin or AdBlock provides the cleanest playback." />
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question
            text={`"Are there alternative websites to watch movies?"`}
          />
          <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            <Link
              href="https://vip.idlixofficialx.net"
              className={linkClassName}
            >
              Idlix
            </Link>{" "}
            is one option, though it carries intrusive gambling ads and suffers from frequent buffering even on fast internet connections.
          </p>
        </article>

        <article className="rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6">
          <Question text={`"Can I contribute to this project?"`} />
          <Answer text="Yes. Pull requests, bug reports, and suggestions are welcome on GitHub." />
        </article>
      </div>
    </div>
  );
}

export default DocsPage;
