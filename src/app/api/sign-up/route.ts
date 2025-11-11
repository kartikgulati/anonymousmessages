// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: Request) {
//   await dbConnect();
//   try {
//     const { username, email, password } = await request.json();

//     const exsitingUserVerifiedByUsername = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });

//     if (exsitingUserVerifiedByUsername) {
//       return Response.json(
//         {
//           success: false,
//           message: "Username is already taken, please choose another username",
//         },
//         { status: 400 }
//       );
//     }

//     const existingUserVerifiedByEmail = await UserModel.findOne({
//       email,
//       isVerified: true,
//     });

//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); //generate 6 digit code

//     if (existingUserVerifiedByEmail) {
      
//         if (existingUserVerifiedByEmail.isVerified) {

//             return Response.json(
//         {
//           success: false,
//           message: "User already exist with this email, please login to continue",
//         },
//         { status: 400 }
//       );
//         } else {
//             const hashedPassword = await bcrypt.hash(password, 10);

//             existingUserVerifiedByEmail.password = hashedPassword;
//             existingUserVerifiedByEmail.verifyCode = verifyCode;
//             existingUserVerifiedByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000); //1 hour expiry

//             await existingUserVerifiedByEmail.save();
            
//         }
//     } else {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const expiryDate = new Date();
//       expiryDate.setHours(expiryDate.getHours() + 1); // verification code valid for only 1 hour

//       const user = new UserModel({
//         username,
//         email,
//         password: hashedPassword,
//         verifyCode: verifyCode,
//         verifiedCodeExpiry: expiryDate,
//         isVerified: false,
//         isAcceptingMessage: true,
//         messages: [],
//       });
//       await user.save();
//     }

//     // send verificationae email

//     const emailResponse = await sendVerificationEmail(email, username, verifyCode);

//     if (!emailResponse.success) {
//       return Response.json(
//         {
//           success: false,
//           message: emailResponse.message,
//         },
//         { status: 500 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: "User registered successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error in registeration of a user:", error);
//     return Response.json(
//       {
//         success: false,
//         message:
//           "Internal server error, please try again later/ error in registering user",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await UserModel.findOne({ username, isVerified: true });
    if (existingUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken. Please choose another." },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email. Please log in." },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);
      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User registered successfully. Verification email sent." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in registration route:", error);
    return Response.json(
      { success: false, message: "Internal server error while registering user." },
      { status: 500 }
    );
  }
}
