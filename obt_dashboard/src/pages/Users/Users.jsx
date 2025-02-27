import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import {
  useAllAuthUsers,
  useAllRoles,
  useCreateAuthUser,
  useUpdateAuthUser,
} from "@/services/users.service";
import { Button } from "@/components/ui/button";
import useAuth from "@/store/useAuth";
import DataTable from "react-data-table-component";
import Loading from "@/components/Loading/Loading";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  userName: z.string().min(2, "Username must be at least 2 characters"),
  phone: z.string().optional(),
  plainPassword: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
});

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data, isLoading } = useAllAuthUsers();
  const { data: roles, isLoading: isLoadingRoles } = useAllRoles();
  const createAuthUser = useCreateAuthUser();
  const updateAuthUser = useUpdateAuthUser();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      phone: "",
      password: "",
      roleId: "",
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("userName", data.userName);
    form.setValue("phone", data.phone);
    form.setValue("plainPassword", data.plainPassword);
    form.setValue("roleId", data.roleId);
    setIsDialogOpen(true);
  };

  const onSubmit = (data) => {
    if (isEditing) {
      updateAuthUser.mutate({ id: currentData.id, data });
    } else {
      createAuthUser.mutate(data);
    }
  };

  useEffect(() => {
    if (createAuthUser.isSuccess || updateAuthUser.isSuccess) {
      toast("Success", {
        description: `${
          createAuthUser?.data?.message || updateAuthUser?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentData(null);
      form.reset();
    }
    if (createAuthUser.error || updateAuthUser.error) {
      toast("Error", {
        description: `${
          createAuthUser?.error?.response?.data?.message ||
          updateAuthUser?.error?.response?.data?.message ||
          createAuthUser?.error?.message ||
          updateAuthUser?.error?.message
        }`,
      });
    }
  }, [
    createAuthUser?.data?.message,
    createAuthUser.error,
    createAuthUser.isSuccess,
    form,
    updateAuthUser?.data?.message,
    updateAuthUser.error,
    updateAuthUser.isSuccess,
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
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role.name,
      sortable: true,
    },
    {
      name: "Last Login",
      selector: (row) => new Date(row.lastLoginTime).toLocaleString(),
      sortable: true,
      width: "180px",
    },
    {
      name: "Last Login IP",
      selector: (row) => row.lastLoginIp,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Password",
      selector: (row) => row.plainPassword,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Auth Users" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Create Auth
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.users || []}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
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
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingRoles && <Loader2 className="mr-2 h-4 w-4" />}
                        {roles?.roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  createAuthUser.isPending ||
                  updateAuthUser.isPending ||
                  authUser?.role?.name === "VIEWER" ||
                  authUser?.role?.name === "DEMO"
                }
              >
                {createAuthUser.isPending || updateAuthUser.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
