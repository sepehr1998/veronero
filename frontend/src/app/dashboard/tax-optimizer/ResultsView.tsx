import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";

interface Props {
    totalIncome: number;
    totalDeductions: number;
}

export const ResultsView = ({ totalIncome, totalDeductions }: Props) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-border p-4 w-full">
                    <CardTitle>Total Income</CardTitle>
                    <CardContent>
                        {totalIncome} $
                    </CardContent>
                </Card>

                <Card className="border-border p-4 w-full">
                    <CardTitle>Total Deductibles</CardTitle>
                    <CardContent>
                        {totalDeductions} $
                    </CardContent>
                </Card>

                <Card className="border-border p-4 w-full">
                    <CardTitle>Current Tax Rate</CardTitle>
                    <CardContent>
                        25 %
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};
