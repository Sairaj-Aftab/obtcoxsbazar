import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import avatar from "../../assets/image/avatar.png";
import Modal from "../../components/Modal/Modal";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import {
  createDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "../../services/driverInof.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverFormSchema } from "@/lib/schemas";
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
  UserRound,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

const ProfileDriverInfo = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const form = useForm({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      paribahanUserId: user.id,
      name: "",
      fatherName: "",
      phone: "",
      license: "",
      address: "",
    },
  });
  const { data: driver, isLoading: getDriverLoading } = useQuery({
    queryKey: ["driverInfo", { id: user.id, page, limit, search }],
    queryFn: () => getDriverInfo({ id: user?.id, page, limit, search }),
  });
  const {
    mutateAsync: createDriver,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createDriverInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["driverInfo"] });
      form.reset();
      setIsEditing(false);
      setIsDialogOpen(false);
      toast.success(data.message);
    },
  });
  const {
    mutateAsync: updateDriver,
    data: updateData,
    isSuccess: updateSuccess,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateDriverInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["driverInfo"] });
      form.reset();
      setIsEditing(false);
      setIsDialogOpen(false);
      toast.success(data.message);
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
    form.setValue("paribahanUserId", data?.paribahanUserId);
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

  async function onSubmit(data) {
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
      await updateDriver({ id: currentData.id, data: formData });
    } else {
      await createDriver(formData);
    }
  }

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Actions",
      cell: (data) => (
        <Button variant="ghost" size="icon" onClick={() => handleView(data)}>
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      ),
      width: "60px",
    },
    {
      name: "Photo",
      cell: (data) => (
        <img
          src={data.imageUrl ? data.imageUrl : avatar}
          alt=""
          style={{ width: "70px", height: "70px", objectFit: "cover" }}
        />
      ),
      width: "70px",
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
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
  ];
  useEffect(() => {
    if (createError || updateError) {
      toast.error(createError?.message || updateError?.message);
    }
  }, [createError, updateError]);

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
                  {formatDateTime(currentData.createdAt)}
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
    <>
      <Toaster />
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Driver Info</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-40 sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-60"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentData(null);
                form.reset();
                setIsDialogOpen(true);
              }}
              className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
            >
              Add driver info
            </button>
          </div>
        </div>
        <DataTable
          columns={column}
          data={driver?.driverInfo
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))}
          responsive
          progressPending={getDriverLoading}
          progressComponent={
            <div className="w-full py-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={
            driver?.totalCount ? driver?.totalCount : driver?.searchCount
          }
          onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200]}
          customStyles={{
            headCells: {
              style: {
                fontSize: "14px",
                fontWeight: "bold",
              },
            },
            rows: {
              style: {
                fontSize: "14px",
                fontWeight: "400",
              },
            },
          }}
        />
      </div>
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
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createLoading || updateLoading}
                  >
                    {createLoading || updateLoading ? (
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
    </>
  );
};

export default ProfileDriverInfo;
