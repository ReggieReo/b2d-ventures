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
    .min(10)
    .max(100),
  website: z
    .string({
      required_error: "Please enter your company's website.",
    })
    .url(),
  target_stock: z.coerce.number({
    required_error: "Please enter the target stock.",
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
    .min(1, "Please upload at least one media file"),
  dataroom: z
    .array(
      z.object({
        url: z.coerce.string(),
        name: z.coerce.string(),
        size: z.coerce.number(),
        key: z.coerce.string(),
      }),
    )
    .optional(),
  logo: z.object(
    {
      url: z.coerce.string(),
      name: z.coerce.string(),
      size: z.coerce.number(),
      key: z.coerce.string(),
    },
    { message: "Please upload a logo." },
  ),
  banner: z.object(
    {
      url: z.coerce.string(),
      name: z.coerce.string(),
      size: z.coerce.number(),
      key: z.coerce.string(),
    },
    { message: "Please upload a banner." },
  ),
  pitch: z
    .string({
      required_error: "Please enter your pitch.",
    })
    .optional(),
});
