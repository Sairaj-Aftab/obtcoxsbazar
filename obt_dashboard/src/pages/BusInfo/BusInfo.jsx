import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDate } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import {
  useCreateBusInfo,
  useDeleteBusInfo,
  useGetAllBusInfo,
  useUpdateBusInfo,
} from "@/services/busInfo.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busInfoFormSchema } from "@/lib/schemas";
import { useParibahanUsers } from "@/services/paribahan.service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, Loader2, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { busTypes } from "@/config/busType";

const BusInfo = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data: users, isLoading: paribahanLoading } = useParibahanUsers({});
  const { data: busInfoData, isLoading: busInfoLoading } = useGetAllBusInfo({
    page,
    limit: rowPage,
    search,
  });
  const [isViewMode, setIsViewMode] = useState(false);

  const createInfo = useCreateBusInfo();
  const updateInfo = useUpdateBusInfo();
  const deleteInfo = useDeleteBusInfo();
  const form = useForm({
    resolver: zodResolver(busInfoFormSchema),
    defaultValues: {
      paribahanName: "",
      regNo: "",
      type: undefined,
      comment: "",
      report: "",
      fcExpire: "",
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("paribahanName", data?.paribahanUser?.paribahanName);
    form.setValue("regNo", data.regNo);
    form.setValue("type", data.type);
    form.setValue("comment", data.comment);
    form.setValue("report", data.report);
    form.setValue("fcExpire", data.fcExpire);
    setIsDialogOpen(true);
  };
  const handleView = (data) => {
    setCurrentData(data);
    setIsViewMode(true);
    setIsDialogOpen(true);
  };

  async function handleSubmit(data) {
    const paribahanUser = users?.paribahanUsers?.find(
      (user) => user.paribahanName === data.paribahanName
    );
    if (!paribahanUser) {
      toast("Error", {
        description: "Invalid Paribahan Name selected.",
      });
      return;
    }
    if (isEditing) {
      updateInfo.mutate({ id: currentData.id, data });
    } else {
      createInfo.mutate({ id: paribahanUser.id, data });
    }
  }

  useEffect(() => {
    if (createInfo.isSuccess || updateInfo.isSuccess || deleteInfo.isSuccess) {
      toast("Success", {
        description: `${
          createInfo?.data?.message ||
          updateInfo?.data?.message ||
          deleteInfo?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createInfo.error || updateInfo.error || deleteInfo.error) {
      toast("Error", {
        description: `${
          createInfo?.error?.response?.data?.message ||
          updateInfo?.error?.response?.data?.message ||
          deleteInfo?.error?.response?.data?.message ||
          createInfo?.error?.message ||
          updateInfo?.error?.message ||
          deleteInfo?.error?.message
        }`,
      });
    }
  }, [
    createInfo?.data?.message,
    createInfo.error,
    createInfo.isSuccess,
    deleteInfo?.data?.message,
    deleteInfo.error,
    deleteInfo.isSuccess,
    form,
    updateInfo?.data?.message,
    updateInfo.error,
    updateInfo.isSuccess,
  ]);

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
      name: "Actions",
      cell: (data) => (
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={() => handleView(data)}>
            <Eye className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsViewMode(false);
              handleEdit(data);
            }}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      ),
    },
    {
      name: "Paribahan",
      selector: (data) => data?.paribahanUser?.paribahanName,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "QR Code",
      selector: (data) => data,
      cell: (data) => {
        return <img src={data.qrCode} alt="" style={{ width: "100px" }} />;
      },
      width: "110px",
    },
    {
      name: "FC Expire",
      selector: (data) => data.fcExpire,
      sortable: true,
      cell: (data) => {
        const currentDate = new Date();
        const fcExpireDate = new Date(data?.fcExpire);
        const isExpired = fcExpireDate < currentDate;

        return (
          <span
            style={{
              color: isExpired ? "red" : "inherit",
              textDecoration: isExpired ? "line-through" : "none",
            }}
          >
            {data.fcExpire}
          </span>
        );
      },
    },
    {
      name: "R. Permit",
      selector: (data) => data.comment,
      sortable: true,
    },
    {
      name: "Report",
      selector: (data) => data.report,
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (data) => formatDate(data.updatedAt),
      sortable: true,
    },
    {
      name: "Created At",
      selector: (data) => formatDate(data.createdAt),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (data) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={authUser?.role?.name === "VIEWER"}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                Bus info and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteInfo.mutate(data.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      right: true, // Align the column to the right
    },
  ];

  const renderViewContent = () => {
    if (!currentData) return null;

    const currentDate = new Date();
    const fcExpireDate = new Date(currentData.fcExpire);
    const isExpired = fcExpireDate < currentDate;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Paribahan"
            value={currentData.paribahanUser?.paribahanName}
          />
          <InfoItem label="Registration No" value={currentData.regNo} />
          <InfoItem label="Type" value={currentData.type} />
          <InfoItem
            label="FC Expire"
            value={currentData.fcExpire}
            customStyle={{
              color: isExpired ? "red" : "inherit",
              textDecoration: isExpired ? "line-through" : "none",
            }}
          />
          <InfoItem
            label="Updated At"
            value={formatDate(currentData.updatedAt)}
          />
          <InfoItem
            label="Entry Date"
            value={formatDate(currentData.createdAt)}
          />
        </div>
        <div className="space-y-2">
          <InfoItem label="Comment" value={currentData.comment} fullWidth />
          <InfoItem label="Report" value={currentData.report} fullWidth />
        </div>
        <div className="flex justify-center">
          <img
            src={currentData.qrCode || "/placeholder.svg?height=128&width=128"}
            alt="QR Code"
            className="w-32 h-32"
          />
        </div>
      </div>
    );
  };

  // eslint-disable-next-line react/prop-types
  const InfoItem = ({ label, value, fullWidth = false, customStyle = {} }) => (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900" style={customStyle}>
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Bus Info" />
        <Button
          onClick={() => {
            setIsViewMode(false);
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add New
        </Button>
      </div>
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        // title="Regular Schedules"
        columns={columns}
        data={busInfoData?.busInfo || []}
        responsive
        progressPending={busInfoLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={
          busInfoData?.searchCount
            ? busInfoData?.searchCount
            : busInfoData?.totalCount
        }
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isViewMode
                ? "Bus Information"
                : isEditing
                ? "Update Bus"
                : "Create Bus"}
            </DialogTitle>
          </DialogHeader>
          {isViewMode ? (
            renderViewContent()
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="paribahanName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paribahan Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Paribahan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paribahanLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {users?.paribahanUsers?.map((data) => (
                            <SelectItem
                              key={data.id}
                              value={data.paribahanName}
                            >
                              {data.paribahanName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="regNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bus type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {busTypes?.map((data) => (
                            <SelectItem key={data.id} value={data.label}>
                              {data.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="report"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fcExpire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Certificate Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={
                      createInfo.isPending ||
                      updateInfo.isPending ||
                      authUser?.role?.name === "VIEWER" ||
                      authUser?.role?.name === "DEMO"
                    }
                  >
                    {createInfo.isPending || updateInfo.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusInfo;
