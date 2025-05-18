import * as z from "zod";

export const scheduleFormSchema = z.object({
  type: z.enum([
    "AC",
    "Non-AC",
    "Sleeper Coach",
    "Double-decker",
    "Suite Class",
    "Hyundai Biz Class",
    "Mercedes-Benz",
    "Local Service",
  ]),
  time: z.string().min(1, "Time is required"),
  busNo: z.string().min(1, "Bus number is required"),
  guideName: z.string().min(1, "Guide name is required"),
  guidePhone: z.string().regex(/^\+?[0-9]+$/, "Invalid phone number"),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  leavingPlace: z.string().min(1, "Leaving place is required"),
  leavingMapLink: z.string().optional(),
  destinationPlace: z.string().min(1, "Destination place is required"),
  rent: z.coerce.number().min(0, "Rent must be a positive number"),
  discountRent: z
    .union([
      z.coerce.number().min(0, "Discount rent must be a positive number"),
      z.literal("").transform(() => undefined),
    ])
    .optional(),
  seatStatus: z.boolean(),
  comment: z.string().nullable().optional(),
});

export const rgScheduleFormSchema = z.object({
  busName: z.string().min(1, "Bus name is required"),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  type: z.enum([
    "AC",
    "Non-AC",
    "Sleeper Coach",
    "Double Decker",
    "Suite Class",
    "Hyundai Biz Class",
    "Mercedes-Benz",
    "Local Service",
  ]),
  leavingPlace: z.string().min(1, "Leaving place is required"),
  destinationPlace: z.string().min(1, "Destination place is required"),
});

// Paribahan User Form
export const paribahanUserFormSchema = z.object({
  paribahanName: z.string().min(2, {
    message: "Paribahan Name must be at least 2 characters.",
  }),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
  salesPerson: z.string().optional(),
  salesNumber: z.string().optional(),
  counterLocation: z.string().optional(),
  counterLocationMap: z.string().optional(),
  plainPassword: z.string().regex(/^\d{5}$/, {
    message: "Password must be a 5-digit number.",
  }),
  type: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one bus type.",
  }),
  destinationId: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one destination.",
  }),
});
// Bus Info Form
export const busInfoFormSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  regNo: z.string().min(1, { message: "Registration Number is required" }),
  type: z.enum(
    [
      "Non-AC",
      "AC",
      "Sleeper Coach",
      "Double-decker",
      "Suite Class",
      "Hyundai Biz Class",
      "Mercedes-Benz",
      "Local Service",
    ],
    {
      required_error: "Bus Type is required",
    }
  ),
  comment: z.string().optional(),
  report: z.string().optional(),
  fcExpire: z
    .string()
    .min(1, { message: "Fitness Certificate Expiry date is required" }),
});
// Driver Form
export const driverFormSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  fatherName: z.string().optional(),
  phone: z.string().optional(),
  license: z.string().optional(),
  address: z.string().optional(),
  comment: z.string().optional(),
  report: z.string().optional(),
});
// Guide Form
export const guideFormSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  comment: z.string().optional(),
  report: z.string().optional(),
});
export const templateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["WELCOME", "BIRTHDAY", "ANNIVERSARY", "PROMOTION", "GENERAL"]),
  showFrom: z.string().min(1, "Show from is required"),
  showUntil: z.string().min(1, "Show until is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
