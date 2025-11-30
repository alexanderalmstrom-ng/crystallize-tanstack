import z from "zod";

export const crystallizeErrorSchema = z.object({
  message: z.string(),
  extensions: z
    .object({
      code: z.string().optional(),
    })
    .optional(),
  locations: z
    .array(
      z.object({
        line: z.number(),
        column: z.number(),
      }),
    )
    .optional(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
});

export const crystallizeResponseSchema = <TResult>() =>
  z.object({
    data: z.custom<TResult | null>(
      (val) => val === null || typeof val === "object",
    ),
    errors: z.array(crystallizeErrorSchema).optional(),
  });

export type CrystallizeResponse<TResult> = z.infer<
  ReturnType<typeof crystallizeResponseSchema<TResult>>
>;

export type CrystallizeError = z.infer<typeof crystallizeErrorSchema>;
