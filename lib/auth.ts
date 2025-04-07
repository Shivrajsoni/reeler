import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";



// options NextAuthType
export const authOptions :NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            // credential milte hei
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}

            },
            // authorization logic 
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error(`email or password is missing `);
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({email:credentials.email});
                    if(!user){
                        throw new Error(`No user Found`);
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.passoword
                    )
                    if(!isValid){
                        throw new Error(`Password Not Matched`);
                    }

                    return {
                        id:user._id.string(),
                        email:user.email
                    }
                } catch (error) {
                    throw new Error(`Error Caught`)
                    
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string;
            }
            return session

        }
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },
    secret:process.env.NEXTAUTH_SECRET
}