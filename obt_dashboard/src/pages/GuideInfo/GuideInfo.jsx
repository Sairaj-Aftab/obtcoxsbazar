import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDate } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import { useParibahanUsers } from "@/services/paribahan.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAllGuideInfo,
  useCreateGuideInfo,
  useUpdateGuideInfo,
} from "@/services/guideInfo.service";
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Home,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Truck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guideFormSchema } from "@/lib/schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const GuideInfo = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const { data: paribahanUsers, isLoading: paribahanUsersLoading } =
    useParibahanUsers({});
  const { authUser } = useAuth();
  const { data: guideInfo, isLoading: guideInfoLoading } = useAllGuideInfo({
    page,
    limit: rowPage,
    search,
  });
  const createGuide = useCreateGuideInfo();
  const updateGuide = useUpdateGuideInfo();

  const form = useForm({
    resolver: zodResolver(guideFormSchema),
    defaultValues: {
      paribahanUserId: "",
      name: "",
      phone: "",
      address: "",
      comment: "",
      report: "",
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("paribahanUserId", data?.paribahanUserId);
    form.setValue("name", data.name);
    form.setValue("phone", data?.phone || "");
    form.setValue("address", data?.address || "");
    form.setValue("comment", data?.comment || "");
    form.setValue("report", data?.report || "");
    setIsDialogOpen(true);
  };
  const handleView = (data) => {
    setCurrentData(data);
    setIsViewMode(true);
    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    if (isEditing) {
      updateGuide.mutate({ id: currentData.id, data });
    } else {
      createGuide.mutate({ data });
    }
  }

  useEffect(() => {
    if (createGuide.isSuccess || updateGuide.isSuccess) {
      toast("Success", {
        description: `${
          createGuide?.data?.message || updateGuide?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createGuide.error || updateGuide.error) {
      toast("Error", {
        description: `${
          createGuide?.error?.response?.data?.message ||
          updateGuide?.error?.response?.data?.message ||
          createGuide?.error?.message ||
          updateGuide?.error?.message
        }`,
      });
    }
  }, [
    createGuide?.data?.message,
    createGuide.error,
    createGuide.isSuccess,
    form,
    updateGuide?.data?.message,
    updateGuide.error,
    updateGuide.isSuccess,
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
  ];

  const renderViewContent = () => {
    if (!currentData) return null;

    return (
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {currentData.name}
              </h2>
              <Badge variant="outline" className="mt-1">
                <Truck className="mr-1 h-5 w-5" />
                <span className="text-base font-semibold">
                  {currentData.paribahanName}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm font-semibold text-primary">
                  {currentData.phone || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Entry Date:</span>
                <span className="text-sm">
                  {formatDate(currentData.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm">
                {currentData.address || "No address information available"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Remarks
            </CardTitle>
            <CardDescription>
              Additional comments about the driver
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentData.comment ? (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {currentData.comment}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No remarks available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </CardTitle>
            <CardDescription>
              Official reports and documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentData.report ? (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {currentData.report}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No reports available
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setIsViewMode(false);
              handleEdit(currentData);
            }}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    );
  };
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
                ? "Guide Information"
                : isEditing
                ? "Update Guide"
                : "Create Guide"}
            </DialogTitle>
          </DialogHeader>
          {isViewMode ? (
            renderViewContent()
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {/* ParibahanUserId */}
                <FormField
                  control={form.control}
                  name="paribahanUserId"
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
                          {paribahanUsersLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {paribahanUsers?.paribahanUsers?.map((data) => (
                            <SelectItem key={data.id} value={data.id}>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={
                      createGuide.isPending ||
                      updateGuide.isPending ||
                      authUser?.role?.name === "VIEWER" ||
                      authUser?.role?.name === "DEMO"
                    }
                  >
                    {createGuide.isPending || updateGuide.isPending ? (
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

export default GuideInfo;
