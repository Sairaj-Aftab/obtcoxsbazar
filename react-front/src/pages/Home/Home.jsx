import BusScheduleTable from "../../components/BusScheduleTable/BusScheduleTable";
import RegularSchedule from "../../components/RegularSchedule/RegularSchedule";
import WhereYouGoSec from "../../components/WhereYouGoSec/WhereYouGoSec";
import VisitorCountSection from "../../components/VisitorCountSection";
import useSchedules from "../../store/useSchedules";

const Home = () => {
  const { regularSchedules, regularScheduleLoader: loader } = useSchedules();

  return (
    <>
      <BusScheduleTable />
      <WhereYouGoSec />
      <RegularSchedule
        data={regularSchedules?.schedules
          ?.slice(0, 10)
          .sort((a, b) => new Date(a.time) - new Date(b.time))}
        loader={loader}
      />
      <VisitorCountSection />
    </>
  );
};

export default Home;
