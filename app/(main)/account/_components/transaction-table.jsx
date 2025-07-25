"use client"
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table ,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import React from 'react'

const RECURRING_INTERVALS = {
    DAILY : "Daily",
    WEEKLY : "Weekly",
    MONTHLY : "Monthly",
    YEARLY : "Yearly",
};

const TransactionTable = ({transactions}) => {

    const filteredAndSortedTransaction = transactions;
    
    const handleSort=()=>{

    }

  return (
    <div className='space-y-'>
      {/*Filters  */}

      {/* transactions */}
      <div>
      
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox></Checkbox>
      </TableHead>
      <TableHead 
      className="cursor-pointer"
      onClick = {()=>handleSort("date")}      
      >
      <div className='flex items-center text-muted-foreground'>Date</div>
      </TableHead>
      <TableHead>
        Description
      </TableHead>
      <TableHead
      className="cursor-pointer"
      onClick = {()=>handleSort("category")}  >
       <div className='flex items-center text-muted-foreground'>Category</div>
      </TableHead>
      <TableHead
      className="cursor-pointer"
      onClick = {()=>handleSort("amount")}  >
        <div className='flex items-center justify-end text-muted-foreground'>Amount</div>
      </TableHead>
      <TableHead className=" text-muted-foreground">Recurring</TableHead>
      <TableHead></TableHead>
      
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredAndSortedTransaction.length ===0?(
        <TableRow>
            <TableCell colSpan = {7} className="text-center text-muted-foreground">No transactions</TableCell>
        </TableRow>
    ):(
        filteredAndSortedTransaction.map((transaction) =>{
            return (
                <TableRow key = {transaction.id}>
      <TableCell><Checkbox/></TableCell>
      <TableCell>{format(new Date(transaction.date), "PPP")}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell className= "capitalize"> 
        <span style={{
            backgroundColor: categoryColors[transaction.category],
        }}
        className='px-2 py-1 rounded text-white'>{transaction.category} 
        </span>
        </TableCell>
        <TableCell
        style = {{
            color:
            transaction.type === "EXPENSE" 
            ? "red"
            : "green"
        }}
        className="text-right font-md">
        {transaction.type === "EXPENSE" ? "-" : "+"} Rs.{transaction.amount.toFixed(2)}
        </TableCell>
        <TableCell>{transaction.isRecurring ?(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className={"gap-1"}>
            <Clock className='h-3 w-3'/>
            {
                RECURRING_INTERVALS[
                    transaction.recurringInterval
                    ]}
                    </Badge>
                    </TooltipTrigger>
                    <TooltipContent></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ):<Badge variant="outline" className={"gap-1"}>
            <Clock className='h-3 w-3'/>One-Time</Badge>}</TableCell>
        </TableRow>    
        )        
        })
        )
    }
  </TableBody>
</Table>
</div>
    </div>
  )
}

export default TransactionTable
