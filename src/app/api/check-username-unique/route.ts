import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";

const UsernameQuerySchema = z.object({
    username: usernameValidation

})

export async function GET(request: Request){

    //use this all the routes

    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: "Method not allowed"
    //     }, 
    //         {status: 405})
        
    // }


await dbConnect();
try {
    const { searchParams } = new URL(request.url);

    // trim input to get the username
    const queryParams = {
        username: (searchParams.get('username') ?? "").toString().trim(),
    };

    //validate query params with zod

   const result = UsernameQuerySchema.safeParse(queryParams);

     // validation failed -> return clear errors
     if (!result.success) {
        const usernameErrors = result.error.format().username?._errors || [];

        return Response.json(
            {
                success: false,
                message: "invalid username",
                errors: usernameErrors,
            },
            { status: 400 }
        );
     }

   //check is username exists in DB

   const {username} = result.data;

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
        return Response.json(
            {
                success: false,
                message: "username already taken",
            },
            { status: 400 }
        );
    }

    return Response.json(
        {
            success: true,
            message: "Username is available",
        },
        { status: 200 }
    );


} catch (error) {
    console.error("username checking failed", error)
    return Response.json({
        success: false,
        message: "error checking username"
    }, {status: 500
    })
    
}
}

