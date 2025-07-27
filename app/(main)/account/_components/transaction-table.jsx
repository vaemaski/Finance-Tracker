"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table ,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, Trash2, Trash2Icon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

const RECURRING_INTERVALS = {
    DAILY : "Daily",
    WEEKLY : "Weekly",
    MONTHLY : "Monthly",
    YEARLY : "Yearly",
};


const TransactionTable = ({transactions}) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field : "date",
    direction: "desc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  
  const filteredAndSortedTransaction = useMemo(()=>{
    let result = [...transactions];

    //apply transactions
    if(searchTerm){
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transactions) => 
        transactions.description?.toLowerCase().includes(searchLower)
      );
    }

  },[
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig,
  ]);
    
  const handleSort=(field)=>{
    setSortConfig((current) =>({
      field ,
      direction : 
      current.field == field && current.direction == "asc" ? "desc" : "asc",
    }));
    };

  const handleSelect = (id)=>{
    setSelectedIds(current => current.includes(id)?current.filter((item)=>item!=id):[...current,id])
  };
    
  const handleSelectAll = ()=>{
    setSelectedIds((current)=>
    current.length === filteredAndSortedTransaction.length
  ? []
  : filteredAndSortedTransaction.map((t)=>t.id)
  );
  };

  const handleBulkDelete = ()=>{}; 
  const handleClearFilter = ()=>{
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  }; 

  return (
    <div className='space-y-4'>
      {/*Filters  */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
          <Input placeholder = "search transactions..."
          value = {searchTerm}
          onChange = {(e)=> setSearchTerm(e.target.value)}
          className="pl-8"></Input>

        </div>
        <div className='flex gap-1'>
          <Select value = {typeFilter} onValueChange = {setTypeFilter}>
            <SelectTrigger >
              <SelectValue placeholder = "All Types"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value = "INCOME">Income</SelectItem>
              <SelectItem value = "EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value = {recurringFilter} onValueChange = {(value)=> setRecurringFilter(value)}>
            <SelectTrigger className= "w-[150px]" >
              <SelectValue placeholder = "All Transactions"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value = "recurring">Recurring Only</SelectItem>
              <SelectItem value = "non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length>0 && <div>
            <Button variant= "destructive" 
            size= "sm"
            onClick = {handleBulkDelete}>
              <Trash2Icon className = "h-4 w-4 mr-2"/>
              Delete Selected ({selectedIds.length})
            </Button>
            </div>}

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button variant= "outline" size="icon" onClick = {handleClearFilter} title = "Clear Filter">
                <X className='h-4 w-5'/>
              </Button>
            )}
        </div>
      </div>

      {/* transactions */}
      <div>
      
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox onCheckedChange = {handleSelectAll}
        checked = {
          selectedIds.length ===
          filteredAndSortedTransaction &&
          filteredAndSortedTransaction.length>0
        }></Checkbox>
      </TableHead>
      <TableHead 
      className="cursor-pointer"
      onClick = {()=>handleSort("date")}      
      >
      <div className='flex items-center text-muted-foreground'>
        Date
         {sortConfig.field === 'date'&&
         (sortConfig.direction === "asc"?( 
         <ChevronUp className='ml-1 h-4 w-4'/>
        ):( 
        <ChevronDown className='ml-1 h-4 w-4'/>
        ))}</div>
      </TableHead>
      <TableHead>
        Description
      </TableHead>
      <TableHead
      className="cursor-pointer"
      onClick = {()=>handleSort("category")}  >
       <div className='flex items-center text-muted-foreground'>
        Category
         {sortConfig.field === 'category' &&
         (sortConfig.direction === "asc"?( 
         <ChevronUp className='ml-1 h-4 w-4'/>
        ):( 
        <ChevronDown className='ml-1 h-4 w-4'/>
        ))}
        </div>
      </TableHead>
      <TableHead
      className="cursor-pointer"
      onClick = {()=>handleSort("amount")}  >
        <div className='flex items-center justify-end text-muted-foreground'>
          Amount
          {sortConfig.field === 'amount'&&
         (sortConfig.direction === "asc"?( 
         <ChevronUp className='ml-1 h-4 w-4'/>
        ):( 
        <ChevronDown className='ml-1 h-4 w-4'/>
        ))}
        </div>
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
      <TableCell><Checkbox onCheckedChange = {()=>handleSelect(transaction.id)}
        checked = {selectedIds.includes(transaction.id)}
        /></TableCell>
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
                      <Badge variant="outline" className ="gap-1 bg-purple-700 text-purple-100 hover:text-white hover:bg-purple-400">
                      <RefreshCw className='h-3 w-3'/>
                      {
                      RECURRING_INTERVALS[transaction.recurringInterval]                      
                      }
                    </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className='text-sm'>
                        <div className='font-md'>Next Date: </div>
                        <div>
                          {format(new Date(transaction.nextRecurringDate), "PPP")}
                        </div>
                      </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ):<Badge variant="outline" className={"gap-1"}>
            <Clock className='h-3 w-3'/>One-Time</Badge>}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant= "ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className='h-4 w-4'/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel
              onClick ={()=> router.push(`/transaction/create?edit=${transaction.id}`)}
              >Edit</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className= "text-destructive"
             // onClick ={()=> deleteFn([transaction.id])}
              >Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
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
