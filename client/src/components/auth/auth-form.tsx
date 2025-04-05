import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserType } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => void;
  isLoading: boolean;
  userType?: string;
}

export default function AuthForm({ type, onSubmit, isLoading, userType = UserType.HACKER }: AuthFormProps) {
  const isLogin = type === "login";

  // Define schemas for both login and register
  const loginSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const registerSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }).max(30, {
      message: "Username must not exceed 30 characters.",
    }).regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and hyphens.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }).max(100, {
      message: "Full name must not exceed 100 characters.",
    }),
    bio: z.string().optional(),
  });

  // Use the appropriate schema based on the form type
  const formSchema = isLogin ? loginSchema : registerSchema;
  
  // Define form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      ...(isLogin ? {} : { email: "", fullName: "", bio: "" }),
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLogin && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLogin && (
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={userType === UserType.HACKER ? "Security researcher with experience in..." : "Our organization focuses on..."}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {userType === UserType.HACKER 
                    ? "Share a bit about your expertise and interests as a security researcher."
                    : "Brief description of your organization or security team."
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLogin ? "Logging in..." : "Creating account..."}
            </>
          ) : (
            <>{isLogin ? "Log in" : "Create account"}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
