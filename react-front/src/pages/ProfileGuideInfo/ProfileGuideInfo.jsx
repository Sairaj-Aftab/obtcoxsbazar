import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { formatDateTime } from "../../utils/formatDateTime";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "../../services/guideInfo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";
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
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guideFormSchema } from "@/lib/schemas";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileGuideInfo = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [isOpen, setIsOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const form = useForm({
    resolver: zodResolver(guideFormSchema),
    defaultValues: {
      paribahanUserId: user.id,
      name: "",
      phone: "",
      address: "",
    },
  });
  const { data: guide, isLoading: guideLoading } = useQuery({
    queryKey: ["guide", { id: user.id, page, limit, search }],
    queryFn: () => getGuideInfo({ id: user.id, page, limit, search }),
  });
  const {
    mutateAsync: createGuide,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createGuideInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guide"] });
      form.reset();
      setIsEditing(false);
      setIsOpen(false);
      toast.success(data.message);
    },
  });
  const {
    mutateAsync: updateGuide,
    data: updateData,
    isSuccess: updateSuccess,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateGuideInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guide"] });
      form.reset();
      setIsEditing(false);
      setIsOpen(false);
      toast.success(data.message);
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("paribahanUserId", data?.paribahanUserId);
    form.setValue("name", data.name);
    form.setValue("phone", data?.phone || "");
    form.setValue("address", data?.address || "");
    setIsOpen(true);
  };
  const handleView = (data) => {
    setCurrentData(data);
    setIsViewMode(true);
    setIsOpen(true);
  };

  const onSubmit = async (data) => {
    if (isEditing) {
      await updateGuide({ id: currentData.id, data });
    } else {
      console.log(data);

      // await createGuide(data);
    }
  };

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
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={() => handleView(data)}>
            <Eye className="h-4 w-4 text-primary" />
          </Button>
        </div>
      ),
      width: "60px",
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
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
  ];

  useEffect(() => {
    if (createError || updateError) {
      toast.error(createError.message || updateError.message);
    }
  }, [createError, updateError]);

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
    <>
      <Toaster />
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Guide Info</h1>
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
                setIsOpen(true);
              }}
              className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
            >
              Add guide info
            </button>
          </div>
        </div>
        <DataTable
          columns={column}
          data={guide?.guideInfo
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))}
          responsive
          progressPending={guideLoading}
          progressComponent={
            <div className="w-full py-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={guide?.count ? guide?.count : guide?.searchCount}
          onChangeRowsPerPage={(newPerPage) => setLimit(newPerPage)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

export default ProfileGuideInfo;
