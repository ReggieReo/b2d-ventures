import { z } from "zod";

const minDeadlineDate = new Date();
minDeadlineDate.setDate(minDeadlineDate.getDate() + 14);

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
  }).min(10, "Stock must be at least 10."),
  industry: z.string({
    required_error: "Please select the industry.",
  }),
  allocation: z.coerce.number({
    required_error: "Please enter the allocation.",
  })
  .min(10, "Allocation must be at least 10.")
  .max(49, "Allocation must be less than 50."),
  valuation: z.coerce.number({
    required_error: "Please enter the valuation.",
  })
  .min(25000, "Minimum valuation must be at least 25000."),
  deadline: z.coerce.date({
    required_error: "Please select a date and time",
  }).refine((date) => date >= minDeadlineDate, {
    message: "Deadline must be at least 2 weeks from today.",
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
  problem: z
    .string({
      required_error: "Please enter the problem.",
    })
    .min(1, "Please enter a problem"),
  solution: z
    .string({
      required_error: "Please enter the solution.",
    })
    .min(1, "Please enter a solution"),
  stage: z
    .string({
      required_error: "Please select the stage.",
    })
    .min(1, "Please select a stage"),
  team: z
    .string({
      required_error: "Please enter the team.",
    })
    .min(1, "Please enter a team"),
  investors: z
    .string({ 
      required_error: "Please enter the investors.",
    })
    .optional(),
  banner: z.object(
    {
      url: z.coerce.string(),
      name: z.coerce.string(),
      size: z.coerce.number(),
      key: z.coerce.string(),
    },
    { message: "Please upload a banner." },
  ),
});
