import { inngest } from "@/lib/inngest/client";
import { db } from "../prisma";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";





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
        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        ); // First day of the month
        
        const expenses = await db.transaction.aggregate({
          where : {
            userId : budget.userId,
            accountId : defaultAccount.id,
            type : "EXPENSE",
            date : {
              gte : startOfMonth,
              lte : endOfMonth,
            },
          },
          _sum : {
            amount : true,
          },
        });
        //R E A L  C O D E
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log("percentage : ", percentageUsed);
        
        
        if (
          percentageUsed>= 85 && 
          (!budget.lastAlertSent || 
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
          ){

            console.log("if block pernt lastAlert : ", percentageUsed, budget.lastAlertSent);
            
            //Send Email
            await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert for ${defaultAccount.name}`,
              react: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                data: {
                  percentageUsed,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAccount.name,
                },
              }),
            });
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