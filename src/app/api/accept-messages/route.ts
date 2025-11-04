import {getServerSession} from "next-auth/next";
import {authOptions} from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import { success } from "zod/mini";


export async function POST(request: Request) {
    dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user 

    if(!session || !session.user) {
        return Response.json(
        {success: false,
            message: "verfication failed"
        },
        {status: 401}
    )
    }

   const userId = user._id

}