

"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback} from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { signInSchema } from "@/schemas/signInSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Toaster } from "@/components/ui/sonner"  
import { signUpSchema } from "@/schemas/signUpSchema";
import { title } from "process";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";


const page = () => {

  const [username, setUsername] = useState('')  
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter();

  //zod implementation 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
       username: '',
        email: '',
        password: ''
      }
    })


   // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=> {
    const checkUsernameUnique = async () => {
       if (username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response =  await axios.get(`/api/check-username-unique?username=${username}`)
         setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username'

          )
        }finally{
          setIsCheckingUsername(false)
        }
       }
    }
    checkUsernameUnique()
  },[username]
)

const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
  setIsSubmitting(true)
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data)

    console.log(response.data.message)
    const message = response.data.message
    setUsernameMessage(message)


    toast({
      title: 'success',
      description: response.data.message
    })
    router.replace(`/verify/${data.username}`)
    setIsSubmitting(false)
  } catch (error) {
    console.error("error signing up of user", error)
    const axiosError = error as AxiosError<ApiResponse>;
    const errorMessage = axiosError.response?.data.message
    toast({
      title: 'Sing up failed',
      description: errorMessage ?? 'Error signing up user',
      variant: 'destructive'
    })
    setIsSubmitting(false)
  }
}

  return (
    <div className=" flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 mt-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Join US
          </h1>
          <p className="mb-4">send and receive messages</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
             <FormField
             name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                />
              </FormControl>
              {isCheckingUsername &&  <Loader className="animate-spin mr-2 h-4 w-4" />}
              <p className= {`text-sm ${usernameMessage ? 'text-green-500': 'text-destructive'}`}>
                {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field}
                 />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit" disabled={isSubmitting}>Sign up</Button>

         {
          isSubmitting ? (
            <> 
            <Loader className="animate-spin mr-2 h-4 w-4" /> Please wait!!!!
             </>
          ) : (' ')
         }
          </form>
        </Form>
        <div className=" text-center mt-5">
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page