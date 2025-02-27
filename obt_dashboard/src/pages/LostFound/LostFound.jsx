import Loading from "@/components/Loading/Loading";
import avatar from "@/assets/img/no-image.jpg";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useAllLostFound } from "@/services/lostFound.service";
import { formatDateTime } from "@/utils/timeAgo";
import { Eye } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const LostFound = () => {
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useAllLostFound({
    page,
    limit: rowPage,
    filters,
  });
  console.log(data);

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (_, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <div>
          <Eye className="w-5 text-primary cursor-pointer" />
        </div>
      ),
      width: "60px",
    },
    {
      name: "Type",
      selector: (data) => data.reportType,
      cell: (data) => (
        <>
          <p
            className={`${data.reportType === "LOST" && "text-red-500"} ${
              data.reportType === "FOUND" && "text-primary"
            } font-bold`}
          >
            {data.reportType}
          </p>
        </>
      ),
      width: "100px",
    },
    {
      name: "Photo",
      cell: (data) => (
        <img
          src={data.imageUrls ? data.imageUrls[0] : avatar}
          alt=""
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      ),
    },
    {
      name: "Item",
      cell: (data) => (
        <div>
          <p className="font-semibold">
            {data.goods.length > 20
              ? `${data.goods.slice(0, 20)}...`
              : data.goods}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.description.length > 20
              ? `${data.description.slice(0, 20)}...`
              : data.description}
          </p>
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Location",
      selector: (data) => data.place,
      sortable: true,
    },
    {
      name: "Date",
      selector: (data) => formatDateTime(data.dateTime),
      sortable: true,
    },
    {
      name: "Status",
      selector: (data) => data.status,
      cell: (data) => (
        <p
          className={`${data.status === "pending" && "text-blue"} ${
            data.status === "resolved" && "text-primary-color"
          } font-bold text-sm`}
        >
          {data.status}
        </p>
      ),
      width: "100px",
    },
  ];

  return (
    <div>
      <PageHeader title={"Lost & Found"} />
      <DataTable
        columns={columns}
        data={data?.reports}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={data?.count}
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};

export default LostFound;
