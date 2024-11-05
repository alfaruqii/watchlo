import Answer from "@/components/docs/Answer";
import Question from "@/components/docs/Question";
import Link from "next/link";

function DocsPage() {
  return (
    <div className="p-4 sm:px-28 lg:px-[23%] flex flex-col gap-6">
      <div>
        <Question text={`"Why you created this?"`} />
        <Answer text="So that if there’s a movie that directly or indirectly supports Israel (🐷), you can watch it for free here without giving any financial support to the film." />
      </div>
      <div>
        <Question text={`"I got error when try to use a subtitle"`} />
        <p>
          Usually this happen because you need to use a open dns like Google;
          for more information, you can look up to{" "}
          <Link
            href="https://www.geeksforgeeks.org/how-to-enable-or-disable-dns-in-google-chrome-browser/"
            className="link"
          >
            this (desktop [same method for android])
          </Link>{" "}
          or{" "}
          <Link href="https://geekdon.com/google-dns-ios" className="link">
            this one for iOS
          </Link>
          .
        </p>
      </div>
      <div>
        <Question text={`"Why is there no subtitle?"`} />
        <p>
          Yeah, sorry, I might have a skill issue here. But you can try finding
          the subtitles on websites like{" "}
          <Link href="https://subdl.com" className="link">
            Subdl
          </Link>{" "}
          or{" "}
          <Link href="https://www.opensubtitles.org/id" className="link">
            OpenSubtitles
          </Link>
          .
        </p>
      </div>
      <div>
        <Question
          text={`"Why are there so many ads when we try to watch the movie?"`}
        />
        <Answer text="It&#39;s because the provider I use places ads there. Oh, by the way, this website itself doesn&#39;t have any ads, and I make zero money from it. If you install an ad blocker or use a browser that can block those ads (I&#39;ll explain how below), you&#39;ll be safe from all the ads." />
      </div>
      <div>
        <Question
          text={`"What adblocker do you usually use, and which browser do you use to deal with all those ads?"`}
        />
        <Answer text="The web browsers I usually use are Brave, Stargon, and FAB Adblocker (on Android). As for adblockers, I definitely use uBlock Origin and AdBlock (the one with the hand logo) to block ads across the web. Oh, just a heads-up, if you use Stargon, you might notice some weird styling, like star ratings looking strange. So, Brave with aggressive mode might be the best choice for iPhone/Android." />
      </div>
      <div>
        <Question
          text={`"Is there another alternative besides this website to watch free movies?"`}
        />
        <p>
          <Link href="https://vip.idlixofficialx.net" className="link">
            Idlix
          </Link>
          , but I don&#39;t really like it. First, it has a lot of online
          gambling ads, and second, it&#39;s really slow. It doesn&#39;t lag,
          but it&#39;s just slow—constantly loading and buffering. Not to brag,
          but I&#39;m using a 50Mbps connection, and it still buffers a lot.
        </p>
      </div>
      <div>
        <Question text={`"Can I contribute to this project?"`} />
        <Answer text="Yes brother (russian accent)." />
      </div>
    </div>
  );
}

export default DocsPage;
