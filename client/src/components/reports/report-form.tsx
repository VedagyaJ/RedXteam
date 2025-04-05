import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SeverityType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReportFormProps {
  onSubmit: (data: any) => void;
  isPending: boolean;
}

// Create a schema for form validation
const reportSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }).max(2000, {
    message: "Description must not exceed 2000 characters."
  }),
  severity: z.enum([
    SeverityType.LOW, 
    SeverityType.MEDIUM, 
    SeverityType.HIGH, 
    SeverityType.CRITICAL
  ], {
    message: "Please select a valid severity level.",
  }),
  stepsToReproduce: z.string().min(20, {
    message: "Steps to reproduce must be at least 20 characters.",
  }).max(2000, {
    message: "Steps to reproduce must not exceed 2000 characters."
  }),
  impact: z.string().min(20, {
    message: "Impact must be at least 20 characters.",
  }).max(1000, {
    message: "Impact must not exceed 1000 characters."
  }),
});

export default function ReportForm({ onSubmit, isPending }: ReportFormProps) {
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: SeverityType.MEDIUM,
      stepsToReproduce: "",
      impact: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof reportSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vulnerability Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Cross-Site Scripting in Search Function" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A clear, concise title summarizing the vulnerability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Severity</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-neutral-400 ml-1 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[250px] text-sm">
                        <strong>Critical:</strong> Direct access to systems or data<br />
                        <strong>High:</strong> Significant impact, sensitive data exposure<br />
                        <strong>Medium:</strong> Limited impact, requires user interaction<br />
                        <strong>Low:</strong> Minor issues with minimal security impact
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={SeverityType.LOW}>Low</SelectItem>
                  <SelectItem value={SeverityType.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={SeverityType.HIGH}>High</SelectItem>
                  <SelectItem value={SeverityType.CRITICAL}>Critical</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Rate the severity based on impact and exploitability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vulnerability Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the vulnerability in detail..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the vulnerability, including affected components.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stepsToReproduce"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steps to Reproduce</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="1. Navigate to...\n2. Enter the following input...\n3. Observe that..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide clear, step-by-step instructions to reproduce the vulnerability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Impact</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explain the potential impact if this vulnerability is exploited..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Describe the potential consequences if this vulnerability were to be exploited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting report...
            </>
          ) : (
            "Submit Vulnerability Report"
          )}
        </Button>
      </form>
    </Form>
  );
}
