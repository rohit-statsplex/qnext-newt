/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must have at least 2 characters.",
  }),
  introductoryParagraph: z.string().optional(),
  numberOfSections: z.string(),
  // numberOfSections: z
  //   .number()
  //   .gt(0, {
  //     message: "Number Of Sections must be atleast 0.",
  //   })
  //   .lte(5, {
  //     message: "Number Of Sections must be atmost 5.",
  //   }),
});

export const defaultValues = {
  title: "",
  introductoryParagraph: "",
  numberOfSections: "1",
};

export const StepOne: React.FC<{
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
}> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-4 rounded border bg-white p-6">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the Newsletter Title"
                  // error={form.formState.errors?.[field.name]?.message}
                  {...field}
                />
              </FormControl>
              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="introductoryParagraph"
          render={({ field }) => (
            <FormItem className="space-y-4 rounded border bg-white p-6">
              <FormLabel>Introductory Paragraph</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the welcome message"
                  // error={form.formState.errors?.[field.name]?.message}
                  {...field}
                />
              </FormControl>
              <FormDescription>&nbsp;</FormDescription>
              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfSections"
          render={({ field }) => (
            <FormItem className="space-y-4 rounded border bg-white p-6">
              <div className="flex items-center space-x-6">
                <FormLabel className="min-w-[185px]">
                  Number of Sections/Topics
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {new Array(5).fill(0).map((_, idx) => (
                      <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                        {idx + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage>&nbsp;</FormMessage>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};
