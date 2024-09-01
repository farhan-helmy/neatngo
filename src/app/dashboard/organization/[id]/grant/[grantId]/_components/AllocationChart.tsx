"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { SelectGrantAllocation } from "@/db/schema"

export function AllocationChart({ allocation }: { allocation: SelectGrantAllocation[] }) {
    const chartData = React.useMemo(() => {
        return allocation.map((item, index) => ({
            category: item.name,
            amount: item.amount,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`
        }))
    }, [allocation])

    const totalAmount = React.useMemo(() => {
        return allocation.reduce((acc, curr) => acc + curr.amount, 0)
    }, [allocation])

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            amount: {
                label: "Amount",
            }
        }
        allocation.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`
            }
        })
        return config
    }, [allocation])

    return (
        <Card className="flex flex-col border-none shadow-none">
            <CardHeader className="items-center pb-0">
                <CardTitle>Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-sm font-bold"
                                                >
                                                    {totalAmount.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Budget
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
