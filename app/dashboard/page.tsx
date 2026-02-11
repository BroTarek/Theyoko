"use client"
import React from 'react'
import { DataTable, schema } from '@/components/data-tables/data-table'
import { OverviewCharts } from '@/components/dashboard/overview-charts'
import { z } from "zod"

import data from "@/data.json"

export default function Page() {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>([])
    const [loading, setLoading] = React.useState(true)

    const uniqueFields = React.useMemo(() => {
        const fields = Array.from(new Set(data.map(item => item.field))).filter(Boolean)
        return fields.sort()
    }, [data])

    const handleDelete = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id))
        return Promise.resolve(true)
    }

    const handleArchive = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id))
        return Promise.resolve(true)
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/submissions')
                const jsonData = await response.json()

                // Map backend data to DataTable schema
                const mappedData = jsonData.map((item: any) => {
                    const fields = Array.isArray(item.fields) ? item.fields.filter(Boolean) : []
                    return {
                        id: item.id,
                        header: item.full_name || "Unknown",
                        field: fields.length > 0 ? fields[0] : "IT", // Fallback to IT if no fields
                        status: item.status || "Unseen",
                        experience: item.experience_level || "N/A",
                        countries: Array.isArray(item.countries_worked_in) ? item.countries_worked_in : []
                    }
                })

                setData(mappedData)
            } catch (error) {
                console.error("Failed to fetch submissions:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="p-10 text-center">Loading dashboard...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary-text">Dashboard</h1>
                <p className="text-secondary-grey">
                    Comprehensive overview of applications and recruitment analytics.
                </p>
            </header>

            <OverviewCharts data={data} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable data={data} onDelete={handleDelete} />
            </div>
        </div>
    )
}
