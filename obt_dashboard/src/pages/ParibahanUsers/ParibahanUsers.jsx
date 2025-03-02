import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDateTime } from "../../utils/timeAgo";
import useAuth from "@/store/useAuth";
import {
  useCreateParibahanUser,
  useDeleteParibahanUser,
  useParibahanUsers,
  useUpdateParibahanUser,
} from "@/services/paribahan.service";
import { Edit, Loader2, MapPin, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paribahanUserFormSchema } from "@/lib/schemas";
import DataTable from "react-data-table-component";
import Loading from "@/components/Loading/Loading";
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
import { Checkbox } from "@/components/ui/checkbox";
import { busTypes } from "@/config/busType";
import { useGetDestinationPlaces } from "@/services/place.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ParibahanUsers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);

  const { authUser } = useAuth();
  const { data: users, isLoading } = useParibahanUsers({ search });
  const createParibahan = useCreateParibahanUser();
  const updateParibahan = useUpdateParibahanUser();
  const deleteParibahan = useDeleteParibahanUser();
  const { data: destinationPlace, isLoading: isDestinationPlaceLoading } =
    useGetDestinationPlaces();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const form = useForm({
    resolver: zodResolver(paribahanUserFormSchema),
    defaultValues: {
      paribahanName: "",
      contactPerson: "",
      contactNumber: "",
      salesPerson: "",
      salesNumber: "",
      counterLocation: "",
      counterLocationMap: "",
      plainPassword: "",
      type: [],
      destinationId: [],
    },
  });

  const generateRandomPassword = () => {
    const randomPassword = Math.floor(10000 + Math.random() * 90000).toString();
    form.setValue("plainPassword", randomPassword);
  };

  // Function to open the dialog for editing a role
  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);

    const typeArray = data.type ? data.type.toString().split("") : [];

    form.setValue("paribahanName", data.paribahanName);
    form.setValue("contactPerson", data.contactPerson);
    form.setValue("contactNumber", data.contactNumber);
    form.setValue("salesPerson", data.salesPerson);
    form.setValue("salesNumber", data.salesNumber);
    form.setValue("plainPassword", data.plainPassword);
    form.setValue("counterLocation", data.counterLocation);
    form.setValue("counterLocationMap", data.counterLocationMap);
    form.setValue("type", typeArray);
    form.setValue("destinationId", data.destinationId);

    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    // Handle form submission
    const typeValue = data.type
      .sort((a, b) => parseInt(a) - parseInt(b))
      .join("");

    const submissionData = {
      ...data,
      type: parseInt(typeValue),
    };

    if (isEditing) {
      updateParibahan.mutate({ id: currentData.id, data: submissionData });
    } else {
      createParibahan.mutate({ authUserId: authUser.id, data: submissionData });
    }
  }

  useEffect(() => {
    if (
      createParibahan.isSuccess ||
      updateParibahan.isSuccess ||
      deleteParibahan.isSuccess
    ) {
      toast("Success", {
        description: `${
          createParibahan?.data?.message ||
          updateParibahan?.data?.message ||
          deleteParibahan?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentData(null);
      form.reset();
    }
    if (
      createParibahan.error ||
      updateParibahan.error ||
      deleteParibahan.error
    ) {
      toast("Error", {
        description: `${
          createParibahan?.error?.response?.data?.message ||
          updateParibahan?.error?.response?.data?.message ||
          deleteParibahan?.error?.response?.data?.message ||
          createParibahan?.error?.message ||
          updateParibahan?.error?.message ||
          deleteParibahan?.error?.message
        }`,
      });
    }
  }, [
    createParibahan?.data?.message,
    createParibahan.error,
    createParibahan.isSuccess,
    deleteParibahan?.data?.message,
    deleteParibahan.error,
    deleteParibahan.isSuccess,
    form,
    updateParibahan?.data?.message,
    updateParibahan.error,
    updateParibahan.isSuccess,
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
      name: "View",
      cell: (data) => (
        <Button
          variant="ghost"
          size="icon"
          disabled={authUser?.role?.name === "VIEWER"}
          onClick={() => handleEdit(data)}
        >
          <Edit className="h-4 w-4 text-primary" />
        </Button>
      ),
      width: "60px",
    },
    {
      name: "paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
      width: "160px",
    },
    {
      name: "Contact Person",
      cell: (data) => (
        <div className="flex flex-col gap-1">
          <p>{data?.contactPerson}</p>
          <a
            href="tel:+88{data?.contactNumber}"
            className="text-primary font-semibold"
          >
            {data?.contactNumber}
          </a>
        </div>
      ),
      sortable: true,
      width: "180px",
    },
    {
      name: "Sales Person",
      cell: (data) => (
        <div className="flex flex-col gap-1">
          <p>{data?.salesPerson}</p>
          <a
            href="tel:+88{data?.salesNumber}"
            className="text-primary font-semibold"
          >
            {data?.salesNumber}
          </a>
        </div>
      ),
      selector: (data) => data.type,
      width: "180px",
    },
    {
      name: "Destinations",
      cell: (data) => (
        <div>
          <ul className="list-disc list-inside space-y-1 py-1">
            {data?.destination?.map((d) => (
              <li key={d?.id}>{d?.placeName}</li>
            ))}
          </ul>
        </div>
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: "Password",
      selector: (data) => data?.plainPassword,
    },
    {
      name: "QR Code",
      cell: (data) => <img src={data?.qrCode} alt="" className="w-14" />,
      sortable: true,
    },
    {
      name: "Counter Location",
      cell: (data) => (
        <div className="flex gap-1 items-center">
          {data?.counterLocationMap && (
            <a href={data?.counterLocationMap} target="_blank">
              <MapPin className="w-5 h-5 text-primary" />
            </a>
          )}

          <span>{data?.counterLocation}</span>
        </div>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "Created by & At",
      selector: (data) => formatDateTime(data.createdAt),
      cell: (data) => (
        <div>
          <p>
            <span>{data?.authUser?.userName}</span> &#10151;{" "}
            <span>{data?.authUser?.role?.name}</span>
          </p>
          <p>{formatDateTime(data.createdAt)}</p>
        </div>
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: "Actions",
      cell: (data) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                schedule and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteParibahan.mutate(data.id)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      right: true, // Align the column to the right
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Paribahan Users" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Create Paribahan User
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
        data={users?.paribahanUsers || []}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        // paginationServer
        // paginationTotalRows={
        //   schedules?.searchCount
        //     ? schedules?.searchCount
        //     : schedules?.totalCount
        // }
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
              {isEditing ? "Update driver" : "Create driver"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paribahanName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paribahan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Paribahan Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Name (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact Phone Number (Optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Sales Name (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sales Phone Number (Optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="counterLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Counter Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Counter Location (Optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="counterLocationMap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Counter Location Map</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Counter Location Map URL (Optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plainPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password (5 digit number)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      <Badge
                        className="cursor-pointer"
                        onClick={generateRandomPassword}
                      >
                        Generate random password
                      </Badge>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Bus Types</FormLabel>
                      <FormDescription>
                        Select the types of buses for this Paribahan.
                      </FormDescription>
                    </div>
                    {busTypes?.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationId"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Destination Places
                      </FormLabel>
                      <FormDescription>
                        Select the destination places for this Paribahan.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {isDestinationPlaceLoading && (
                        <Loader2 className="animate-spin w-5 h-5" />
                      )}
                      {destinationPlace?.places?.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="destinationId"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.placeName}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createParibahan.isPending ||
                    updateParibahan.isPending ||
                    authUser?.role?.name === "VIEWER" ||
                    authUser?.role?.name === "DEMO"
                  }
                >
                  {createParibahan.isPending || updateParibahan.isPending ? (
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParibahanUsers;
