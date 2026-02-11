"use client"
import React from 'react'
import { DataTable, schema } from '@/components/data-tables/data-table'
import { z } from "zod"
import { Archive, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ApplicantsArchivePage() {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>([])
    const [loading, setLoading] = React.useState(true)

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/archived/submissions')
            const jsonData = await response.json()

            const mappedData = jsonData.map((item: any) => {
                const fields = Array.isArray(item.fields) ? item.fields.filter(Boolean) : []
                return {
                    id: item.id,
                    header: item.full_name || "Unknown",
                    field: fields.length > 0 ? fields[0] : "IT",
                    status: item.status || "Unseen",
                    experience: item.experience_level || "N/A",
                    countries: Array.isArray(item.countries_worked_in) ? item.countries_worked_in : []
                }
            })

            setData(mappedData)
        } catch (error) {
            console.error("Failed to fetch archived submissions:", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return <div className="p-10 text-center">Loading archives...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 mb-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-primary-text flex items-center gap-3">
                        <Archive className="w-8 h-8 text-kaizen-red" />
                        Applicants Archive
                    </h1>
                    <p className="text-secondary-grey">
                        Review and manage archived applicant profiles.
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    data={data}
                    isArchivePage={true}
                    onArchive={async () => {
                        fetchData()
                        return true
                    }}
                />
            </div>
        </div>
    )
}
