"use client";
import { useEffect, useState} from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod"
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input';
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Loader } from 'lucide-react';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { toast } from 'sonner';
const CreateAccountDrawer = ({children}) => {
  
  const [open, setOpen] = useState(false);
  
  const {register,
      handleSubmit,
      formState:{errors},
      setValue,
      watch,
      reset} = useForm ({
      resolver : zodResolver(accountSchema),
    defaultValues:{
      name : "",
      type : "CURRENT",
      balance : "",
      isDefault : false,
    }
  })
 

  //USE FETCH
  const {data: newAccount,
    loading : createAccountLoading,
     error,
     fn : createAccountFn,
     
    } = useFetch(createAccount) ;

     
  const onSubmit = async (data)=>{
     console.log(data);
  }

    //toast when account created
    useEffect(()=>{
      if(newAccount){
        toast.success("Account successfully created");
        reset();
        setOpen(false);
      }
    }, [newAccount, reset]);

    //toast when acc creation meets an error
    useEffect(()=>{
      if(error){
        toast.error(error.message || "Failed to create account :/")
      }
    },[error]);

    return (
    <Drawer open = {open} onOpenChange = {setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            </DrawerHeader>
            <div className='px-2 pb-4'>
              <form  className='space-y-4 px-2 pb-4' onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor='name' className='text-sm font-medium pb-4' >
                     Account Name
                  </label>
                  <Input id="name" placeholder = "e.g., Main Checking"
                  {...register("name")}
                  />
                  {errors.name && (
                    <p className='text-sm text-red-500'>{errors.name.message}</p>
                  )}
                </div>

                {/* account type */}
                <div>
                  <label htmlFor='type' className='text-sm font-medium pb-4' >
                     Account Type
                  </label>
                  <Select onValueChange ={(value)=>setValue("type", value)}>
                    <SelectTrigger id = "type">
                    <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                    </SelectContent>
                    </Select>
                  {errors.type && (
                    <p className='text-sm text-red-500'>{errors.type.message}</p>
                  )}
                </div>

                {/* initial balance */}
                <div>
                  <label htmlFor='balance' className='text-sm font-medium pb-4' >
                     Initial Balance
                  </label>
                  <Input
                  id = "balance"
                  type = "number"
                  step = "0.01"
                  placeholder = "0.00"
                  {...register("balance")}
                  />
                  {errors.balance && (
                    <p className='text-sm text-red-500'>{errors.balance.message}</p>
                  )}
                </div>

                {/* set default */}
                <div className='flex items-center justify-between rounded-lg border p-3'>
                 <div className='space-y-0.5'>
                   <label htmlFor='isDefault' className='text-sm font-medium cursor-pointer'>
                  Set as Default 
                  </label>
                  <p className='text-small text-muted-foreground'> This account will be selected by default for transaction</p>
                 </div>
                  <Switch id = "isDefault"
                  onCheckedChange = {(checked)=> setValue("isDefault" , checked)}
                  checked = {watch("isDefault")} 
                  >
                     
                  </Switch>
                </div>

                <div className='flex gap-4 pt-4'>
                  <DrawerClose asChild>
                    <Button type = "button" variant = "outline" className = "flex-1">
                      Cancel
                    </Button>

                  </DrawerClose>

                  <Button type = "submit" 
                  className= "flex-1"
                  disabled = {createAccountLoading}
                  >
                    {createAccountLoading?(
                      <>
                      <Loader className='mr-2 h-3 w-3 animate-spin'> </Loader>
                      Creating...
                     </>
                    ):(
                      "Create Account"
                    ) } 
                    </Button>
                </div>

              </form>
            </div>
        </DrawerContent>
    </Drawer>
  )
}

export default CreateAccountDrawer
