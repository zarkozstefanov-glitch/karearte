import { Home, homeMeta } from "@/components/views/Home";

export const metadata = homeMeta("en");
export default function Page() {
  return <Home lang="en" />;
}
