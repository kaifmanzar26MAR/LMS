import mongoose from 'mongoose';

type ConnectionObject={
    isConnected?: number
}

const connection:ConnectionObject= {}


async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected Database");
        return;
    }

    try {
       const db= await mongoose.connect(process.env.DATABASE_URL || '');
       connection.isConnected=db.connection.readyState;
       console.log("DB connected Successfylly");
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1);
    }
}

export default dbConnect;