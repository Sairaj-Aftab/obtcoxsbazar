import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDate } from "../../utils/timeAgo";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import avatar from "../../assets/img/avatar.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParibahanUsers } from "@/services/paribahan.service";
import useAuth from "@/store/useAuth";
import {
  useAllDriverInfo,
  useCreateDriverInfo,
  useUpdateDriverInfo,
} from "@/services/driverInfo.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverFormSchema } from "@/lib/schemas";
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
  Shield,
  Truck,
  UserRound,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DriverInfo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { data: paribahan, isLoading: paribahanLoading } = useParibahanUsers(
    {}
  );
  const { authUser } = useAuth();
  const { data: driverInfo, isLoading: driverInfoLoading } = useAllDriverInfo({
    page,
    limit: rowPage,
    search,
  });
  const createDriver = useCreateDriverInfo();
  const updateDriver = useUpdateDriverInfo();

  const form = useForm({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      paribahanUserId: "",
      name: "",
      fatherName: "",
      phone: "",
      license: "",
      address: "",
      comment: "",
      report: "",
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("paribahanUserId", data?.paribahanUser?.id);
    form.setValue("name", data.name);
    form.setValue("fatherName", data?.fatherName || "");
    form.setValue("phone", data?.phone || "");
    form.setValue("license", data?.license || "");
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

  function onSubmit(data) {
    const formData = new FormData();

    // Append all regular fields
    Object.keys(data).forEach((key) => {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    });

    if (file) {
      formData.append("photo", file);
    }

    if (isEditing) {
      updateDriver.mutate({ id: currentData.id, data: formData });
    } else {
      createDriver.mutate(formData);
    }
  }

  useEffect(() => {
    if (createDriver.isSuccess || updateDriver.isSuccess) {
      toast("Success", {
        description: `${
          createDriver?.data?.message || updateDriver?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentData(null);
      setFile(null);
      form.reset();
    }
    if (createDriver.error || updateDriver.error) {
      toast("Error", {
        description: `${
          createDriver?.error?.response?.data?.message ||
          updateDriver?.error?.response?.data?.message ||
          createDriver?.error?.message ||
          updateDriver?.error?.message
        }`,
      });
    }
  }, [
    createDriver?.data?.message,
    createDriver.error,
    createDriver.isSuccess,
    form,
    updateDriver?.data?.message,
    updateDriver.error,
    updateDriver.isSuccess,
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
              setFile(null);
              setPreviewUrl(null);
              setIsViewMode(false);
              handleEdit(data);
            }}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
        </div>
      ),
      width: "100px",
    },
    {
      name: "Photo",
      cell: (data) => (
        <img
          src={data.imageUrl ? data.imageUrl : avatar}
          alt=""
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      ),
      width: "100px",
      style: {
        padding: "0",
      },
    },
    {
      name: "Name",
      selector: (data) => data.name,
      sortable: true,
    },
    {
      name: "Father Name",
      selector: (data) => data.fatherName,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (data) => data.phone,
      sortable: true,
    },
    {
      name: "License",
      selector: (data) => data.license,
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (data) => data.paribahanName,
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
          <div className="flex-shrink-0">
            <div className="relative h-48 w-48 overflow-hidden rounded-lg border shadow-sm">
              <img
                src={currentData.imageUrl ? currentData.imageUrl : avatar}
                alt={currentData.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

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
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Father&apos;s Name:</span>
                <span className="text-sm">
                  {currentData.fatherName || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">License:</span>
                <span className="text-sm">{currentData.license || "N/A"}</span>
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
              setFile(null);
              setPreviewUrl(null);
              setIsViewMode(false);
              handleEdit(currentData);
            }}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Driver
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Driver Info" />
        <Button
          onClick={() => {
            setCurrentData(null);
            setFile(null);
            setIsViewMode(false);
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add Driver
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
        data={driverInfo?.driverInfo || []}
        responsive
        progressPending={driverInfoLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={
          driverInfo?.searchCount
            ? driverInfo?.searchCount
            : driverInfo?.totalCount
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
                ? "Driver Information"
                : isEditing
                ? "Update Driver"
                : "Create Driver"}
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
                          {paribahanLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {paribahan?.paribahanUsers?.map((data) => (
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
                <div className="space-y-2">
                  <FormLabel>Driver Photo (Optional)</FormLabel>
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : currentData?.imageUrl ? (
                        <img
                          src={currentData.imageUrl}
                          alt="Current"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload a photo of the driver (optional)
                      </p>
                    </div>
                  </div>
                </div>
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
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father Name</FormLabel>
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
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License</FormLabel>
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
                      createDriver.isPending ||
                      updateDriver.isPending ||
                      authUser?.role?.name === "VIEWER" ||
                      authUser?.role?.name === "DEMO"
                    }
                  >
                    {createDriver.isPending || updateDriver.isPending ? (
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

export default DriverInfo;
