import dbConnect  from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail"; 


export async function POST(request: Request){
    await dbConnect();
    try {
       const {username, email, password} = await request.json()

       const exsitingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerfied: true
       })

       if (exsitingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username is already taken, please choose another username"
        },{status:400}
    )}

    const existingUserVerifiedByEmail = await UserModel.findOne({
        email,
        isVarified:true
    })
    if(existingUserVerifiedByEmail){
        true //todo: send email will say user verified by email
    }else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = newDate();
        expiryDate.setHours(expiryDate.gethours() +1); // verification code valid for only 1 hour
        
    }

    } catch (error) {
        console.log("Error in registeration of a user:", error);
        return Response.json({
            success:false,
            message:"Internal server error, please try again later/ error in registering user"
        },
    {
        status:500
    })

    }
}