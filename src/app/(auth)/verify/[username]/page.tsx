"use client";
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner" 
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function verifyAccount() {
    const router = useRouter();
    const param   = useParams<{username:string}>();
   
     // eslint-disable-next-line react-hooks/rules-of-hooks
        const form = useForm<z.infer<typeof verifySchema>>({
          resolver: zodResolver(verifySchema),
            
          }
        )

        const onSubmit = async (data: z.infer<typeof verifySchema>) => {
            try {
                const response = await axios.post('/api/verify-code', {
                    username: param.username,
                    code:data.code
                })

                toast.success("Account verified successfully!", {
                    description: response.data.message,
                })

                router.replace('/sign-in')
            } catch (error) {
                console.error("error signing up of user", error)
                    const axiosError = error as AxiosError<ApiResponse>;
                    const errorMessage = axiosError.response?.data.message
                
                    toast.error("Account verification failed", {
                  description: errorMessage ?? "Error verfifing code",
                });
            }
        }
  return (
    <div className='flex justify-center items-center min-h-screen'>
        <div className="w-full max-w-md p-8 space-y-8 mt-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">
           Verify Your Account
          </h1>
            </div>

            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}

export default verifyAccount