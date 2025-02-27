import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDate } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import { useParibahanUsers } from "@/services/paribahan.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllGuideInfo } from "@/services/guideInfo.service";

const GuideInfo = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const { data: paribahanUsers, isLoading: paribahanUsersLoading } =
    useParibahanUsers({});
  const { authUser } = useAuth();
  const { data: guideInfo, isLoading: guideInfoLoading } = useAllGuideInfo({
    page,
    limit: rowPage,
    search,
  });

  const [input, setInput] = useState({
    id: "",
    paribahanName: "",
    name: "",
    phone: "",
    address: "",
    comment: "",
    report: "",
  });

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Name",
      selector: (data) => data.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "Address",
      selector: (data) => data.address,
      sortable: true,
    },
    {
      name: "Remark",
      selector: (data) => data.comment,
      sortable: true,
    },
    {
      name: "Report",
      selector: (data) => data.report,
      sortable: true,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDate(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      right: true, // Align the column to the right
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Guide Info" />
        <Button
          onClick={() => {
            setIsViewMode(false);
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add Guide
        </Button>
      </div>
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={guideInfo?.guideInfo || []}
        responsive
        progressPending={guideInfoLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={guideInfo?.count}
        onChangeRowsPerPage={(rowsPerPage) => setRowPage(rowsPerPage)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};

export default GuideInfo;
