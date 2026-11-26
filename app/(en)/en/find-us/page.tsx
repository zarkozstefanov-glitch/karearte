import { FindUsPage, findMeta } from "@/components/views/Pages";

export const metadata = findMeta("en");
export default function Page() {
  return <FindUsPage lang="en" />;
}
