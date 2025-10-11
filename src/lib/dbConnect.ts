import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?: number;
}

const connection: ConnectionObject  = {};

async function dbConnect(): Promise<void>{
    if (connection.isConnected){
        console.log("Already connected");
        return;
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || "",{})

       connection.isConnected = db.connections[0].readyState;

       console.log("connected to db");
    } catch (error) {

        console.log("db connection faild", error)

        process.exit(1);
        
    } 
}

export default dbConnect;