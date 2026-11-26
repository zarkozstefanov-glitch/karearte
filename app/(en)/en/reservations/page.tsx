import { ReservationsPage, reservationsMeta } from "@/components/views/Pages";

export const metadata = reservationsMeta("en");
export default function Page() {
  return <ReservationsPage lang="en" />;
}
