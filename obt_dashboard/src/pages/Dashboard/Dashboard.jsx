import { useEffect } from "react";
import demoImg from "../../assets/img/specialities/specialities-01.png";
import PageHeader from "../../components/PageHeader/PageHeader";
import Avatar from "../../components/Avatar/Avatar";
import { divisions, districts, unions, upazilas } from "bd_geolocation_api";
import { useSelector } from "react-redux";
import { getAllData } from "../../features/user/userSlice";
import { authData } from "../../features/auth/authSlice";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import ScheduleTableList from "../../components/ScheduleTableList/ScheduleTableList";

const Dashboard = () => {
  const { schedules } = useSelector(schedulesData);
  const { paribahanUsers } = useSelector(getAllData);
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

  const todaysSchedules = schedules?.filter((schedule) => {
    const scheduleDate = new Date(schedule.time).toISOString().split("T")[0];
    return scheduleDate === formattedToday;
  });

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="row">
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>
                    {todaysSchedules?.length > 0 ? todaysSchedules.length : 0}
                  </h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Daily Bus Schedule List</h6>
                {/* <div className="progress progress-sm">
                  <div className="progress-bar bg-primary w-50"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{schedules?.length > 0 ? schedules.length : 0}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Bus Schedule List</h6>
                {/* <div className="progress progress-sm">
                  <div className="progress-bar bg-primary w-50"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-success">
                  <i class="fa fa-bus" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{paribahanUsers?.length}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Bus Company</h6>
                {/* <div className="progress progress-sm">
                  <div className="progress-bar bg-success w-50"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-danger border-danger">
                  <i className="fe fe-money"></i>
                </span>
                <div className="dash-count">
                  <h3>485</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Appointment</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-danger w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-warning border-warning">
                  <i className="fe fe-folder"></i>
                </span>
                <div className="dash-count">
                  <h3>$62523</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Revenue</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-warning w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* Table Data */}
      <ScheduleTableList />
    </>
  );
};

export default Dashboard;
