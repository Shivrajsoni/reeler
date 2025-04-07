import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { error } from "console";
import User from "@/models/user";

export async function POST(request:NextRequest,response:NextResponse){
    

    try {
        const {email,password} = await request.json();
        if(!email || !password){
            return NextResponse.json({
                error:`Email and passoword is required for authentication`
            },{status:403});
        }
        await connectToDatabase();

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({
                message:"User Exist try with another Email"
            },{status:403});
        }

        await User.create({
            email,
            password
        })
        return NextResponse.json({message:"User Created Successfully "},{status:200});
        
    } catch (error) {
        return NextResponse.json({
            error:"Failed in registration"
        },{status:503})
    }

}