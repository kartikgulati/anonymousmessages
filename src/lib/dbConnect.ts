import mongoose from "mongoose";

//define a connection object interface
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {}; // creating connection object to track the connection status

async function dbConnect(): Promise<void> {
  // check if we have connection to our DB
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }
  //if not, create a new connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("connected to db");
  } catch (error) {
    // if error in connection

    console.log("db connection faild", error); //print the error to the console

    process.exit(1); //exit the process with failure
  }
}

export default dbConnect;
