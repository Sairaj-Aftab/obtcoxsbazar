import AllBusListed from "@/components/AllBusListed/AllBusListed";
import BusScheduleTable from "@/components/BusScheduleTable/BusScheduleTable";
import WhereYouGoSec from "@/components/WhereYouGoSec/WhereYouGoSec";

export default async function Home() {
  return (
    <main>
      <BusScheduleTable />
      <WhereYouGoSec />
      <AllBusListed />
    </main>
  );
}
