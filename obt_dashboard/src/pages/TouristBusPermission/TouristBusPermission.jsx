import PageHeader from "../../components/PageHeader/PageHeader";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { formatDateAndTime, formatDateTime } from "../../utils/timeAgo";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Bus,
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Truck,
  User,
  Users,
} from "lucide-react";
import {
  useAllTouristBusPermission,
  useUpdateTouristBusPermission,
} from "@/services/touristBusPer.service";
import { Switch } from "@/components/ui/switch";
import { useAllSettings, useUpdateSetting } from "@/services/settings.service";
import {
  Dialog,
  DialogContent,
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const rejectionReasons = [
  "Rejected",
  "Traffic Jam in Town Area",
  "Incomplete Bus Reg. Number",
  "Incomplete Information",
  "Wrong selection of parking area",
];

const formSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectedReason: z.string().optional(),
});

const noticeSchema = z.object({
  description: z.string().min(1, "Notice content is required"),
});

const TouristBusPermission = () => {
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNoticeDialogOpen, setIsNoticeDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const { data, isLoading } = useAllTouristBusPermission({
    page,
    limit: rowPage,
  });
  const updatePermissionStatus = useUpdateTouristBusPermission();
  const updateSetting = useUpdateSetting();

  const { authUser } = useAuth();
  const { data: settings, isLoading: settingLoading } = useAllSettings();
  const [setting, setSetting] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      rejectedReason: "",
    },
  });

  const noticeForm = useForm({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleReview = (data) => {
    setSelectedPermission(data);
    form.setValue("status", data.status);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (settings) {
      setSetting(
        settings?.settings?.find(
          (set) => set.name === "TOURIST-BUS-ENTRY-PERMISSION"
        )
      );
    }
  }, [settings]);

  function onSubmit(data) {
    if (selectedPermission) {
      updatePermissionStatus.mutate({
        id: selectedPermission.id,
        status: data.status,
        rejectedReason: data.rejectedReason,
      });
    }
  }

  const handleOnOffPermission = (status) => {
    updateSetting.mutate({ id: setting.id, data: { status } });
  };

  function onNoticeSubmit(data) {
    updateSetting.mutate({
      id: setting.id,
      data: { description: data.description },
    });
  }

  useEffect(() => {
    if (updatePermissionStatus.isSuccess || updateSetting.isSuccess) {
      setIsDialogOpen(false);
      setIsNoticeDialogOpen(false);
      form.reset();
      noticeForm.reset();
    }
    if (updatePermissionStatus.error || updateSetting.error) {
      toast("Error", {
        description: `${
          updatePermissionStatus?.error?.response?.data?.message ||
          updatePermissionStatus?.error?.message ||
          updateSetting?.error?.message
        }`,
      });
    }
  }, [
    form,
    noticeForm,
    updatePermissionStatus?.data?.data?.message,
    updatePermissionStatus.error,
    updatePermissionStatus.isSuccess,
    updateSetting.error,
    updateSetting.isSuccess,
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
      name: "Review",
      cell: (data) => (
        <Button variant="ghost" size="icon" onClick={() => handleReview(data)}>
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      ),
      width: "70px",
    },
    {
      name: "Status",
      cell: (data) => (
        <Badge
          variant={
            data.approved
              ? "success"
              : data.rejected
              ? "destructive"
              : "default"
          }
        >
          {data.approved ? "Approved" : data.rejected ? "Rejected" : "Pending"}
        </Badge>
      ),
      width: "140px",
    },
    {
      name: "App. No.",
      selector: (data) => data.applicationNo,
      sortable: true,
      width: "100px",
    },
    {
      name: "Applicant Name",
      selector: (data) => data.applicantName,
      sortable: true,
      width: "150px",
    },
    {
      name: "Phone No.",
      selector: (data) => data.phone,
      sortable: true,
      width: "150px",
    },
    {
      name: "Institution & Arrival Place",
      selector: (data) => data.institutionName,
      sortable: true,
    },
    {
      name: "Arrival Date & Time",
      selector: (data) => formatDateAndTime(data.arrivalDateTime),
      sortable: true,
      width: "150px",
    },
    {
      name: "No of Tourist",
      selector: (data) => data.numberTourist,
      width: "100px",
    },
    {
      name: "Number of Bus",
      selector: (data) => data.numberBus,
      width: "100px",
    },
    {
      name: "Transport Name",
      selector: (data) => data.transportName,
    },
    {
      name: "Vehicle Reg.",
      selector: (data) => data.vehicleRegNo,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationName,
    },
    {
      name: "Parking Place",
      selector: (data) => data.parkingPlace,
    },
    {
      name: "Return Date & Time",
      selector: (data) => formatDateTime(data.returnDateTime),
    },
    {
      name: "Description",
      selector: (data) => data.description,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Tourist Bus Permission" />
        <div className="flex items-center space-x-2">
          {settingLoading || updateSetting.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Switch
                checked={setting?.status}
                onCheckedChange={handleOnOffPermission}
              />
              <span>{setting?.status ? "ON" : "OFF"}</span>
            </>
          )}
        </div>
      </div>
      {!setting?.status && (
        <div className="flex gap-1 items-center mb-2">
          {setting?.description && (
            <>
              <marquee direction="">{setting?.description}</marquee>
              <Button
                variant="ghost"
                size="icon"
                disabled={authUser?.role?.name === "VIEWER"}
                onClick={() => {
                  noticeForm.setValue("description", setting?.description);
                  setIsNoticeDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
            </>
          )}
        </div>
      )}
      <DataTable
        columns={columns}
        data={data?.permissions}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] sm:max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permission Review</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardContent className="py-3 px-3">
                <h3 className="text-base font-semibold mb-2">
                  Applicant Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">
                      {selectedPermission?.applicantName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{selectedPermission?.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span className="font-medium">Institution:</span>
                    <span className="ml-2">
                      {selectedPermission?.institutionName}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-3">
                <h3 className="text-base font-semibold mb-2">Trip Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="font-medium">Arrival:</span>
                    <span className="ml-2">
                      {formatDateAndTime(selectedPermission?.arrivalDateTime)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="font-medium">Tourists:</span>
                    <span className="ml-2">
                      {selectedPermission?.numberTourist}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center">
                      <Bus className="mr-2 h-4 w-4" />
                      <span className="font-medium">Buses:</span>
                      <span className="ml-2">
                        {selectedPermission?.numberBus}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Reg:</span>
                      <span className="ml-2">
                        {selectedPermission?.vehicleRegNo}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-3">
                <h3 className="text-base font-semibold mb-2">
                  Transport Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    <span className="font-medium">Transport:</span>
                    <span className="ml-2">
                      {selectedPermission?.transportName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="font-medium">Destination:</span>
                    <span className="ml-2">
                      {selectedPermission?.destinationName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="font-medium">Parking:</span>
                    <span className="ml-2">
                      {selectedPermission?.parkingPlace}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3 px-3">
                <h3 className="text-base font-semibold mb-2">
                  Additional Info
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="font-medium">Return:</span>
                    <span className="ml-2">
                      {formatDateAndTime(selectedPermission?.returnDateTime)}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <FileText className="mr-2 h-4 w-4 mt-1" />
                    <span className="font-medium">Description:</span>
                    <span className="ml-2">
                      {selectedPermission?.description}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {selectedPermission?.pending && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex gap-3 items-center my-3">
                      <FormLabel>Status :</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-3 items-center !m-0"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="approved" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Approve
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rejected" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Reject
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("status") === "rejected" && (
                  <FormField
                    control={form.control}
                    name="rejectedReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Rejection</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rejectionReasons.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  type="submit"
                  disabled={updatePermissionStatus.isPending}
                >
                  {updatePermissionStatus.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      {/* Notice update Dialog */}
      <Dialog open={isNoticeDialogOpen} onOpenChange={setIsNoticeDialogOpen}>
        <DialogContent className="max-h-[95vh] sm:max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>

          <Form {...noticeForm}>
            <form
              onSubmit={noticeForm.handleSubmit(onNoticeSubmit)}
              className="space-y-3"
            >
              <FormField
                control={noticeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter notice content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updateSetting.isPending}>
                {updateSetting.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TouristBusPermission;
