"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) =>{
    const serialized = {...obj};

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
} 

export async function createAccount(data) {
    try {
        //find user from clerk
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        // // Get request data for ArcJet
        // const req = await request();


        //check if user exists inside the database
        const user = await db.user.findUnique({
            where : {
                clerkUserId : userId
            },
        });

        if(!user) throw new Error("User not found");

        //convert balance into float
        const balanceFloat = parseFloat(data.balance)
        if(isNaN(balanceFloat)) throw new Error("Invalid balance amount");

        //check if there are more accounts of the user
        const existingAccount = await db.account.findMany({
            where : {userId : userId},
        })

        //check for deafult
        const shouldBeDefault = existingAccount.length===0?true:data.isDefault;
        
        //if this should be default acc
        if(shouldBeDefault){
            await db.account.updateMany({
                where : {userId : user.id, isDefault : true},
                data : {isDefault : false},
            });
        }

        //create new account
        const account = await db.account.create({
            data : {
                ...data,
                balance : balanceFloat,
                userId : user.id,
                isDefault : shouldBeDefault,
            },
        });
        //cannot return acc because nextjs doesnt support decimals hence convert this to number 
        const serializedAccount = serializeTransaction(account);


        revalidatePath("/dashboard");
        return { success : true , data : serializedAccount};
    } catch (error) {
        throw new Error(error.message)
    }
}