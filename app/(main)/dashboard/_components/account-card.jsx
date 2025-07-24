"use client";
import { updateDefaultAccount } from '@/actions/accounts';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
const AccountCard = ({account}) => {
const {name, type , id, balance, isDefault} = account;
//usefetch
const {
    loading : updateDefaultLoading,
     error,
     fn : updateDefaultFn,
     data : updatedAccount     
    } = useFetch(updateDefaultAccount) ;
const handleDefaultChange = async (event)=>{
    event.preventDefault();
    event.stopPropagation();

    if(isDefault){
        toast.warning("You need atleast one default account!");
        return; //dont allow toggling off the default acc
    }
    await updateDefaultFn(id);
};
useEffect(()=>{
    if(updatedAccount?.success){
        toast.success("Default account updated successfully");
        
        Router.refresh();
    }
},[updatedAccount])
useEffect(()=>{
    if(error){
        toast.error(error.message || "account updation failed");
    }
},[error])
  return (
    <Card className=" hover:shadow-md transition-shadow group relative"> 
        <Link href = {`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 " >
            <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
            <Switch checked = {isDefault}
            onCheckedChange={() => handleDefaultChange(new Event('click'))} // Use onCheckedChange for shadcn Switch
                onClick={handleDefaultChange} // Keep onClick for good measure
                disabled={updateDefaultLoading}
                />
        </CardHeader>
        <CardContent>
            <div className='text-2xl font-bold'>
                ${parseFloat(balance).toFixed(2)}
            </div>
            <p className='text-xs text-muted-foreground'>
                {type.charAt(0) +type.slice(1).toLowerCase()} Account
            </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2">
            <div className='flex items-center'>
                <ArrowUpRight className='mr-1 h-4 w-4 text-green-500'/>
                Income</div>

            <div className='flex items-center'>
                <ArrowDownRight className='mr-1 h-4 w-4 text-red-500'/>
                Expense</div>
            
        </CardFooter>
        </Link>
        
    </Card>
  )
}
export default AccountCard