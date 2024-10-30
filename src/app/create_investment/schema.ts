import { z } from "zod";
import { isCreditCard } from "validator";

// const FormSchema =

export function getInvestmentSchema(min_investment: number) {
  return z.object({
    terms: z.boolean().default(false),

    cardNumber: z
      .string()
      .min(1, { message: "Credit card number is required." })
      .refine((value) => isCreditCard(value.replace(/\s/g, "")), {
        message: "Please enter a valid credit card number.",
      })
      .refine(
        (value) => {
          const digits = value.replace(/\s/g, "");
          return digits.length >= 13 && digits.length <= 16;
        },
        {
          message: "Credit card number must be between 13 and 16 digits.",
        },
      ),

    expirationDate: z
      .string()
      .min(1, { message: "Expiration date is required." })
      .refine(
        (value) => {
          const [month, year] = value.split("/");
          if (!month || !year || month.length !== 2 || year.length !== 2)
            return false;

          const currentDate = new Date();
          const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);

          return !isNaN(expDate.getTime()) && expDate > currentDate;
        },
        {
          message: "Please enter a valid expiration date (MM/YY)",
        },
      ),

    cvv: z
      .string()
      .min(1, { message: "CVV is required." })
      .refine((value) => /^\d{3,4}$/.test(value), {
        message: "Please enter a valid CVV (3-4 digits)",
      }),

    amount: z
      .number({
        required_error: "Amount is required.",
        invalid_type_error: "Amount must be a number.",
      })
      .min(min_investment, {
        message: `Minimum investment amount is ${min_investment} $`,
      })
      .positive({
        message: "Amount must be positive.",
      }),
  });
}

export const schema = z.object({
  terms: z.boolean().default(false),
  cardNumber: z.string(),
  expirationDate: z.string(),
  cvv: z.string(),
  amount: z.number(),
});
