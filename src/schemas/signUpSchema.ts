import {z} from 'zod'

export const usernameValidation  = z
.string()
.min(2,"username must be atleast 2 char long")
.max(20,"username must be atmost 20 char long")
.regex(/^[a-zA-Z0-9_]+$/,"username can only contain letters, numbers and underscores")
.trim()


export const signUpSchema  = z.object({
    username: usernameValidation,
    email: z.string().email({message: "please enter valid email"}).trim(),
    password: z.string().min(6,{message:"Password must be atleast 6 char long"}).max(20,{message:"Password must be atmost 20 char long"}).trim(),
    
})