import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/store/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Edit, Loader2, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable from "react-data-table-component";
import Loading from "@/components/Loading/Loading";
import {
  useCreateAuthNotice,
  useGetAllParibahanNotice,
  useGetAuthNotice,
  useUpdateAdminNotice,
  useUpdateParibahanNotice,
} from "@/services/notice.service";
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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string().min(1, "Status is required").optional(),
});

const Notice = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data: authNotices, isLoading: authNoticesLoading } =
    useGetAuthNotice();
  const { data: paribahanNotices, isLoading: paribahanNoticesLoading } =
    useGetAllParibahanNotice();
  const createNotice = useCreateAuthNotice();
  const updateNotice = useUpdateAdminNotice();
  const updateParibahanNotice = useUpdateParibahanNotice();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "",
    },
  });

  async function onSubmit(data) {
    if (isEditing) {
      updateNotice.mutate({
        id: currentData.id,
        title: data.title,
      });
    } else {
      createNotice.mutate({
        id: authUser.id,
        data,
      });
    }
  }

  // const handleEditShowModal = (id) => {
  //   const noticeToEdit = (authNotices || [])
  //     .concat(paribahanNotices || [])
  //     .find((notice) => notice.id === id);
  //   if (noticeToEdit) {
  //     setEditNotice({
  //       id: noticeToEdit.id,
  //       title: noticeToEdit.title,
  //       status: noticeToEdit.status,
  //     });
  //   }
  // };

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.reset({
      title: data.title,
    });
    form.setValue("title", data.title);
    setIsDialogOpen(true);
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  useEffect(() => {
    if (createNotice.isSuccess || updateNotice.isSuccess) {
      toast("Success", {
        description: `${
          createNotice?.data?.message || updateNotice?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createNotice.error || updateNotice.error) {
      toast("Error", {
        description: `${
          createNotice?.error?.response?.data?.message ||
          updateNotice?.error?.response?.data?.message ||
          createNotice?.error?.message ||
          updateNotice?.error?.message
        }`,
      });
    }
  }, [
    createNotice?.data?.message,
    createNotice.error,
    createNotice.isSuccess,
    form,
    updateNotice?.data?.message,
    updateNotice.error,
    updateNotice.isSuccess,
  ]);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
    },
    {
      name: "Actions",
      cell: (data) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            disabled={authUser?.role?.name === "VIEWER"}
            onClick={() => handleEdit(data)}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
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
                  notice and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                // onClick={() => deleteSchedule.mutate(data.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      width: "120px",
    },
    {
      name: "User",
      cell: (data) => (
        <div>
          {data?.authUser?.userName || data?.paribahanUser?.paribahanName}
          {data?.authUser && " To "}
          {data?.authUser?.userName && <Badge>{data.status}</Badge>}
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "Title & Explanation",
      selector: (data) => data.title,
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Notice Board" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add Notice
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
        data={authNotices?.notices?.concat(paribahanNotices?.notices) || []}
        responsive
        progressPending={authNoticesLoading || paribahanNoticesLoading}
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
              {isEditing ? "Update notice" : "Create notice"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Time */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title & Explanation</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Status */}
              {!isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Passenger">Passenger</SelectItem>
                          <SelectItem value="Display">Display</SelectItem>
                          <SelectItem value="Paribahan">Paribahan</SelectItem>
                          <SelectItem value="Tourist-Bus-Permission">
                            Tourist-Bus-Permission
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createNotice.isPending ||
                    updateNotice.isPending ||
                    authUser?.role?.name === "VIEWER" ||
                    authUser?.role?.name === "DEMO"
                  }
                >
                  {createNotice.isPending || updateNotice.isPending ? (
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

export default Notice;
