import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { success } from "zod/mini";
import { is } from "zod/locales";

export async function POST(request: Request) {
await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

    if (!session || !session.user) {
    return Response.json(
        { success: false, message: "verfication failed" },
        { status: 401 }
    );
}

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessage: acceptMessages },
        { new: true }
    );

    if (!updatedUser) {
        return Response.json(
        { success: false, message: "message acceptance failed" },
        { status: 401 }
        );
    }

    return Response.json(
        {success: true,
            message: "can accept messages - setting updated successfully",
        },
        {status: 200}
    )

    } catch (error) {
    console.log("failed to update message acceptance setting", error);
    return Response.json(
        { success: false, message: "verfication failed" },
        { status: 500 }
    );
    }
}

export async function GET(request: Request) {
await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

    if (!session || !session.user) {
    return Response.json(
        { success: false, message: "verfication failed" },
        { status: 401 }
    );
}

    const userId = user._id;
    try {
           const foundUser = await UserModel.findById(userId);

     if (!foundUser) {
        return Response.json(
        { success: false, message: "user not found" },
        { status: 404 }
        );
    }

    return Response.json(
        {success: true,
            message: "Use found",
            isAcceptingMessage:  foundUser.isAcceptingMessage
        },
        {status: 200}
    )


    } catch (error) {
        console.log("failed to update message acceptance setting", error);
    return Response.json(
        { success: false, message: "error in getting message acceptance status" },
        { status: 500 }
    );
    }
}