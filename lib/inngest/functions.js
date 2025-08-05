import { inngest } from "@/lib/inngest/client";
import { db } from "../prisma";




export const chekBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({step }) => {
    const budgets = await step.run("fetch-budget", async ()=>{
      return await db.budget.findMany({
        include : {
          user : {
            include :{
              accounts : {
                where : {
                  isDefault : true,
                },
              },
            },
          },
        },
      });
    });
    for (const budget of budgets ){
      const defaultAccount = budget.user.accounts[0];
      if(!defaultAccount) continue;
      
      await step.run(`check-budget-Rs.${budget.id}`, async()=>{
        const startDate = new Date();
        startDate.setDate(1); // First day of the month
        const expenses = await db.transaction.aggregate({
          where : {
            userId : budget.userId,
            accountId : defaultAccount.id,
            type : "EXPENSE",
            date : {
              gte : startDate,
            },
          },
          _sum : {
            amount : true,
          },
        });
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount.toNumber();
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed>= 0 && 
          (!budget.lastAlertSent || 
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
          ){
            //Send Email
            //Update lastAlertSent
            await db.budget.update({
              where : { id : budget.id },
              data : { lastAlertSent : new Date() },
            });

          }
      });
    }

  },
);

function isNewMonth(lastAlertDate, currentDate){
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}