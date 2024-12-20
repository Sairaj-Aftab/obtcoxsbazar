import BusScheduleTable from "../../components/BusScheduleTable/BusScheduleTable";
import RegularSchedule from "../../components/RegularSchedule/RegularSchedule";
import WhereYouGoSec from "../../components/WhereYouGoSec/WhereYouGoSec";
import { useSelector } from "react-redux";
import { rgSchedulesData } from "../../features/regularBusSchedule/regularBusScheduleSlice";
import VisitorCountSection from "../../components/VisitorCountSection";

const Home = () => {
  const { rgSchedules, loader } = useSelector(rgSchedulesData);

  return (
    <>
      <BusScheduleTable />
      <WhereYouGoSec />
      <RegularSchedule
        data={rgSchedules
          ?.slice(0, 10)
          .sort((a, b) => new Date(a.time) - new Date(b.time))}
        loader={loader}
      />
      <VisitorCountSection />
    </>
  );
};

export default Home;
