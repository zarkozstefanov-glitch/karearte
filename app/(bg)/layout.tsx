import { Shell } from "@/components/Shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="bg">{children}</Shell>;
}
