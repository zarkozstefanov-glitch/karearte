import { notFound } from "next/navigation";
import { PostPage, postMeta, posts } from "@/components/views/Pages";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return p ? postMeta("bg", p) : {};
}
export default async function Page({ params }: P) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  return <PostPage lang="bg" p={p} />;
}
