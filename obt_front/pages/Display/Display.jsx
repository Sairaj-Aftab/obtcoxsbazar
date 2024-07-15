import "./display.css";
const Display = () => {
  return (
    <div className="bg-black h-screen w-full flex items-center justify-center fixed -z-10">
      <div className="w-full flex flex-col gap-14">
        <div className="text-white flex flex-col items-center">
          <h1 className="text-white text-3xl font-bold"></h1>
          <div className="head_text_parent relative w-full h-14">
            <h1 className="head_text text-3xl md:text-5xl text-center font-extrabold text-slate-400 absolute top-0 left-0 right-0 h-full">
              Online Bus Terminal
            </h1>
          </div>
          <span className="text-white text-2xl font-semibold">Cox's Bazar</span>
        </div>

        <div className="block">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Paribahan</th>

                <th>Reg No</th>
                <th>Departure Place</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>

                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>

                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>

                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>

                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
              <tr>
                <td>10:30AM</td>
                <td>GreenLine</td>

                <td>15-2233</td>
                <td>Dolphin Mor</td>
                <td>Dampara</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Display;
