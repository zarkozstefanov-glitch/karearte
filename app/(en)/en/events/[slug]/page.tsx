import { notFound } from "next/navigation";
import { EventPage, eventMeta, events } from "@/components/views/Pages";

export const dynamicParams = false;
export const generateStaticParams = () => events.map((e) => ({ slug: e.slug }));
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  return e ? eventMeta("en", e) : {};
}
export default async function Page({ params }: P) {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  if (!e) notFound();
  return <EventPage lang="en" e={e} />;
}
