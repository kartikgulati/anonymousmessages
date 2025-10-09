import {z} from "zod";

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10,{message:"content must be atleast 10 char long"})
    .max(500,{message:"content must be atmost 500 char long"})

    
})