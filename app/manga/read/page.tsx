import { redirect } from "next/navigation";
import MangaReaderStage from "@/components/manga/MangaReaderStage";
import { MangaService } from "@/services";
import { MangaPage, MangaChapter, MangaDetailInfo } from "@/types/manga.type";

export const dynamic = "force-dynamic";

interface MangaReadPageProps {
  searchParams: Promise<{ id?: string; chapter?: string }>;
}

export default async function MangaReadPage({ searchParams }: MangaReadPageProps) {
  const resolvedParams = await searchParams;
  const { id, chapter } = resolvedParams;

  if (!id) {
    redirect("/manga");
  }

  if (!chapter) {
    redirect(`/manga/detail/${id}`);
  }

  const [readSettled, chaptersSettled, infoSettled] = await Promise.allSettled([
    MangaService.readMangaChapter(chapter),
    MangaService.getMangaChapters(id, "all"),
    MangaService.getMangaInfo(id),
  ]);

  const readData =
    readSettled.status === "fulfilled"
      ? readSettled.value.data?.data || readSettled.value.data || null
      : null;

  const chaptersData =
    chaptersSettled.status === "fulfilled"
      ? chaptersSettled.value.data?.data || chaptersSettled.value.data || null
      : null;

  const mangaInfo: MangaDetailInfo | null =
    infoSettled.status === "fulfilled"
      ? infoSettled.value.data?.data || infoSettled.value.data || null
      : null;

  const pages: MangaPage[] = Array.isArray(readData?.pages)
    ? readData.pages
    : [];

  const chapters: MangaChapter[] = Array.isArray(chaptersData?.chapters)
    ? chaptersData.chapters
    : [];

  return (
    <MangaReaderStage
      mangaId={Number(id)}
      chapterId={chapter}
      mangaInfo={mangaInfo}
      chapters={chapters}
      pages={pages}
    />
  );
}
