import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Loader2, Star, UploadIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { reviewFormSchema } from "@/lib/schemas";
import { useNavigate } from "react-router-dom";

// Function to get rating comment
const getRatingComment = (rating) => {
  switch (rating) {
    case "1":
      return "Very Bad";
    case "2":
      return "Bad";
    case "3":
      return "Good";
    case "4":
      return "Very Good";
    case "5":
      return "Excellent";
    default:
      return "";
  }
};

// eslint-disable-next-line react/prop-types
export function ReviewForm({ busId, paribahanName, deviceInfo, ipAddress }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: "",
      name: "",
      phoneNumber: "",
      regNo: "",
      destination: "",
      tripTime: "",
      comment: "",
      images: [],
    },
  });

  // Handle form submission
  async function onSubmit(data) {
    if (submitted) {
      toast.error("Review already submitted!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Append all regular fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append device info and IP address
      formData.append("paribahanName", paribahanName);
      formData.append("phoneName", deviceInfo.phoneName);
      formData.append("phoneModel", deviceInfo.phoneModel);
      formData.append("ipAddress", ipAddress);

      // Append files with the SAME FIELD NAME for backend array handling
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Submit the review
      await axios.post(
        `${import.meta.env.VITE_API_URL}/review/create/${busId}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Review submitted successfully!");
      setSubmitted(true);
      form.reset();
      setFiles([]);
      setPreviews([]);

      // Refresh the page data
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchedRating = form.watch("rating");

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      form.setValue("images", [...form.getValues("images"), ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-2 border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-primary">
              🌟 Your Rating 🌟
            </h2>
            <p className="text-muted-foreground">
              {watchedRating
                ? `- ${getRatingComment(watchedRating)} -`
                : "Select your rating"}
            </p>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((ratingValue) => (
                        <button
                          type="button"
                          key={ratingValue}
                          onClick={() => field.onChange(ratingValue.toString())}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              "h-8 w-8 transition-all",
                              Number.parseInt(field.value) >= ratingValue
                                ? "fill-primary text-primary"
                                : "text-muted stroke-muted-foreground"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tripTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Trip Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Select trip date and time"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Your Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Bus/Coach No.
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter bus registration number"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Route/Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter route or location"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Comment
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      className="min-h-[120px] resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      isSubmitting && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Images
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("images")?.click()
                          }
                          disabled={isSubmitting}
                        >
                          <UploadIcon className="mr-2 h-4 w-4" />
                          Upload Images
                        </Button>
                        <FormDescription>
                          {files.length > 0
                            ? `${files.length} file(s) selected`
                            : "Upload images if available"}
                        </FormDescription>
                      </div>
                      {previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {previews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview || ""}
                                alt={`Preview ${index + 1}`}
                                width={300}
                                height={300}
                                className="rounded-md object-cover w-full aspect-square"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6"
                                onClick={() => removeFile(index)}
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || submitted}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : submitted ? (
              "Review Submitted"
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
