import { EventsPage, eventsMeta } from "@/components/views/Pages";

export const metadata = eventsMeta("en");
export default function Page() {
  return <EventsPage lang="en" />;
}
