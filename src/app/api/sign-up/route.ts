import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const exsitingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerfied: true,
    });

    if (exsitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken, please choose another username",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
      isVarified: true,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); //generate 6 digit code

    if (existingUserVerifiedByEmail) {
      
        if (existingUserVerifiedByEmail.isVerified) {

            return Response.json(
        {
          success: false,
          message: "User already exist witha this email, please login to continue",
        },
        { status: 500 }
      );
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);

            existingUserVerifiedByEmail.password = hashedPassword;
            existingUserVerifiedByEmail.verifyCode = verifyCode;
            existingUserVerifiedByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000); //1 hour expiry

            await existingUserVerifiedByEmail.save();
            
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // verification code valid for only 1 hour

      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifiedCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await user.save();
    }

    // send verificationae email

    const emailResponse = await sendVerficationEmail(
      email,
      verifyCode,
      username
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "User registered successfully",
      },
      { status: 500 }
    );
  } catch (error) {
    console.log("Error in registeration of a user:", error);
    return Response.json(
      {
        success: false,
        message:
          "Internal server error, please try again later/ error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
