import RegularSchedule from "../../components/RegularSchedule/RegularSchedule";
import useSchedules from "../../store/useSchedules";

const RegularBusSchedule = () => {
  const { regularSchedules, regularSchedulesLoader: loader } = useSchedules();
  return (
    <RegularSchedule
      data={regularSchedules?.schedules
        ?.slice()
        .sort((a, b) => new Date(a.time) - new Date(b.time))}
      loader={loader}
    />
  );
};

export default RegularBusSchedule;
