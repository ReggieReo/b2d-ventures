import { z } from "zod";

export const formSchema = z.object({
  company: z
    .string({
      required_error: "Please enter your company name.",
    })
    .min(2)
    .max(50),
  slogan: z
    .string({
      required_error: "Please enter your business slogan.",
    })
    .min(2)
    .max(50),
  website: z
    .string({
      required_error: "Please enter your company's website.",
    })
    .url(),
  target_fund: z.coerce.number({
    required_error: "Please enter the target fund.",
  }),
  industry: z.string({
    required_error: "Please select the industry.",
  }),
  min_investment: z.coerce.number({
    required_error: "Please enter the minimum investment.",
  }),
  allocation: z.coerce.number({
    required_error: "Please enter the allocation.",
  }),
  valuation: z.coerce.number({
    required_error: "Please enter the valuation.",
  }),
  deadline: z.coerce.date({
    required_error: "Please select a date and time",
  }),
  media: z
    .array(
      z.object({
        url: z.coerce.string(),
        name: z.coerce.string(),
        size: z.coerce.number(),
        key: z.coerce.string(),
      }),
    )
    // .min(1),
    .nullable(),
  logo: z
    .object({
      url: z.coerce.string(),
      name: z.coerce.string(),
      size: z.coerce.number(),
      key: z.coerce.string(),
    })
    .nullable(),
  pitch: z.string({
    required_error: "Please enter your pitch.",
  }),
});
