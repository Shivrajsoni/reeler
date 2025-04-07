import mongoose from "mongoose";
const mongodb_url = process.env.MONGODB_URL || "";
if(!mongodb_url){
    throw new Error(`Error in Mongo Url`);
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null,promise:null};

}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize:10
        }
        cached.promise = mongoose.connect(mongodb_url,opts).then(()=>mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw new Error(`Error in Connection`)
    }
    console.log(`Connected to the database`);
    return cached.conn;
    
}