"use client"
import { DataTable, schema } from '@/components/data-tables/data-table'
import { OverviewCharts } from '@/components/dashboard/overview-charts'
import { z } from "zod"

import data from "@/data.json"

export default function Page() {
    const typedData = data as z.infer<typeof schema>[]

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary-text">Dashboard</h1>
                <p className="text-secondary-grey">
                    Comprehensive overview of applications and recruitment analytics.
                </p>
            </header>

            <OverviewCharts data={typedData} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable data={typedData} />
            </div>
        </div>
    )
}
