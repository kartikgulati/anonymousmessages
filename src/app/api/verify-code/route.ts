import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import {success, z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";
import { decode } from "punycode";
import { is } from "zod/locales";


export async function POST (request: Request){
    await dbConnect();

    try {
       const{username, code} = await request.json();

       const decodedUsername = decodeURIComponent(username);

       const user = await UserModel.findOne({username: decodedUsername})

       if (!user) {
        return Response.json({
        success: false,
        message: "user not found"
    }, {status: 500
    })        
 }

 const isCodeValid = user.verifyCode === code 
 const isCodeNotExpired  = new Date(user.verifiedCodeExpiry) > new Date()

if (isCodeValid && isCodeNotExpired) {
    user.isVerified = true;
    await user.save();

    return Response.json({
        success: true,
        message: "User verified successfully"
    }, {status: 200
    })
    
}else if(!isCodeNotExpired){
    return Response.json({
        success: false,
        message: "User verification code has expired, please request a new code"
    }, {status: 400
    })
}else{
    return Response.json({
        success: false,
        message: "incorrect verification code"
    }, {status: 400
    })
}


    } catch (error) {
         console.error("verifing username", error)
    return Response.json({
        success: false,
        message: "error verifying username"
    }, {status: 500
    })
    }

}