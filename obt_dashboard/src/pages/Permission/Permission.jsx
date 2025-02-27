import PageHeader from "../../components/PageHeader/PageHeader";
import { timeAgo } from "../../utils/timeAgo";
import useAuth from "@/store/useAuth";
import DataTable from "react-data-table-component";
import Loading from "@/components/Loading/Loading";
import {
  useAllPermissions,
  useCreatePermission,
} from "@/services/users.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const Permission = () => {
  const { authUser } = useAuth();
  const { data, isLoading } = useAllPermissions();
  const createPermission = useCreatePermission();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  function onSubmit(data) {
    createPermission.mutate(data.name);
  }

  useEffect(() => {
    if (createPermission.isSuccess) {
      toast("Success", {
        description: `${createPermission?.data?.message}`,
      });
      form.reset();
    }
    if (createPermission.error) {
      toast("Error", {
        description: `${
          createPermission?.error?.response?.data?.message ||
          createPermission?.error?.message
        }`,
      });
    }
  }, [
    createPermission?.data?.message,
    createPermission.error,
    createPermission.isSuccess,
    form,
  ]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => timeAgo(row.createdAt),
      sortable: true,
    },
  ];
  return (
    <>
      <PageHeader title="Permission" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-3 mb-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              createPermission.isPending ||
              authUser?.role?.name === "VIEWER" ||
              authUser?.role?.name === "DEMO"
            }
          >
            {createPermission.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      <DataTable
        columns={columns}
        data={data?.permission}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
      />
    </>
  );
};

export default Permission;
