import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
    userName = "Vaishali",
    type = "budget-alert",
    data = {
        percentageUsed : 85,
        budgetAmount : 4000,
        totalExpenses : 3400,
    },
}) {
    if(type === "monthly-alert"){

    }
    if(type === "budget-alert"){
        return (
            <Html>
                <Head/>
                <Preview>Budget Alert</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Budget Alert</Heading>
                        <Text style={styles.text} >Hello {userName},</Text>
                        <Text style={styles.text}>
                            You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your monthly budget.
                        </Text>
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Budget Amount</Text>
                                <Text style={styles.heading}>Rs.{data?.budgetAmount}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Spent So Far</Text>
                                <Text style={styles.heading}>Rs.{data?.totalExpenses}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Remaining</Text>
                                <Text style={styles.heading}>Rs.{data?.budgetAmount - data?.totalExpenses}</Text>
                            </div>

                            
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
        }
}
const styles = {
    body : {
        backgroundColor: "#f6f9fc",
        fontFamily : "-apple-system, sans-serif"
    },
    container : {
        backgroundColor : "#ffffff",
        margin : "0 auto",
        padding : "20px",
        borderRadius : "5px",
        boxShadow : "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title : {
        color : "#1f2937",
        fontSize : "32px",
        fontWeight : "bold",
        textAlign : "center",
        margin :  "0 0 20px",
    },
    heading : {
        color : "#1f2937",
        fontSize : "20px",
        fontWeight : "600",
        margin : "0 0 16px",
    },
    text : {
        color : "#4b5563",
        fontSize : "16px",
        margin : "0 0 16px",
    },
    statsContainer:{
        margin : "32px 0",
        padding : "20px",
        backgroundColor : "#fdfdfdff",
        borderRadius : "5px",
    },
    stat: {
        marginBottom :  "16px",
        padding : "12px",
        backgroundColor : "#ffffffff",
        borderRadius : "5px",
        boxShadow : "0 1px 2px rgba(0, 0, 0, 0.1)",
    },
};