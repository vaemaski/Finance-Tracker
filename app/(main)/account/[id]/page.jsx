import { getAccountWithTransaction } from '@/actions/accounts';
import { Slice } from 'lucide-react';
import { notFound } from 'next/navigation';
import React from 'react';

const AccountsPage = async ({params}) => {
    const awaitedParams = await params;
    const accountData = await getAccountWithTransaction(awaitedParams.id);
    if(!accountData) {
        notFound();
    }
    const  {transactions, ...account} = accountData;
  return (
    <div className='space-y-8 px-5 flex gap-4 items-end justify-between'>
      <div>
        <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{account.name}</h1>
        <p>{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
      </div>

      <div className='text-right pb-2'>
        <div className='text-xl sm:text-2xl font-bold'>${parseFloat(account.balance)}</div>
        <p className='text-sm text-muted-foreground'>{account._count.transactions}Transactions</p>
      </div>

      {/* chat section */}

      {/* transaction table */}
    </div>
  );
};

export default AccountsPage;