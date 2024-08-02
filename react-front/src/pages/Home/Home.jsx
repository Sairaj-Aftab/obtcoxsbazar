import AllBusListed from "../../components/AllBusListed/AllBusListed";
import BusScheduleTable from "../../components/BusScheduleTable/BusScheduleTable";
import WhereYouGoSec from "../../components/WhereYouGoSec/WhereYouGoSec";

const Home = () => {
  return (
    <>
      <BusScheduleTable />
      <WhereYouGoSec />
      <AllBusListed />
    </>
  );
};

export default Home;
