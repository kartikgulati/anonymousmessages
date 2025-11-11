

"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import {Link} from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
// import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
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



const page = () => {

  const [username, setUsername] = useState('')  
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300)
  const { toast } = useToast()
  const router = useRouter();

  //zod implementation 
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
     identifier: '',
      password: ''
    }
  })


   // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=> {
    const checkUsernameUnique = async () => {
       if (debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response =  await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
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
  },[debouncedUsername]
)

const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
  setIsSubmitting(true)
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data)
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
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Join US
          </h1>
          <p className="mb-4">send and receive messages</p>
        </div>
        

      </div>
    </div>
  )
}

export default page