"use client"
import { useParams } from 'next/navigation'
import { DataTable, schema } from '@/components/data-table'
import { z } from "zod"
import data from "@/data.json"
import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, Building2, Filter, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'

const COLORS = ['#BC002D', '#365AD6', '#181B31', '#8A8A91', '#ff6900', '#9b51e0']

const CompanyDetailPage = () => {
    const params = useParams()
    const topicName = decodeURIComponent(params.TopicName as string)
    const companyName = decodeURIComponent(params.ComapnyName as string)

    const typedData = data as z.infer<typeof schema>[]

    // Filter data by the field (topic)
    const filteredData = useMemo(() => {
        return typedData.filter(item => item.field === topicName)
    }, [topicName, typedData])

    // Process Data for Referral Resources based on filtered data
    const referralData = useMemo(() => {
        const sources = ['LinkedIn', 'Wazzuf', 'Indeed', 'Referral', 'Social Media', 'WhatsApp']
        const counts: Record<string, number> = {}
        filteredData.forEach((item, index) => {
            const source = (item as any).referralSource || sources[index % sources.length]
            counts[source] = (counts[source] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [filteredData])

    // Process Data for Experience based on filtered data
    const experienceData = useMemo(() => {
        const counts: Record<string, number> = {}
        filteredData.forEach((item) => {
            let exp = item.experience || 'Other'
            if (exp.includes('0-5')) exp = '0-5y'
            else if (exp.includes('5-10')) exp = '5-10y'
            else if (exp.includes('10+')) exp = '10y+'
            else if (!isNaN(Number(exp))) {
                const years = Number(exp)
                if (years < 5) exp = '0-5y'
                else if (years < 10) exp = '5-10y'
                else exp = '10y+'
            }
            counts[exp] = (counts[exp] || 0) + 1
        })
        const order = ['0-5y', '5-10y', '10y+', 'Other']
        return order
            .filter(name => counts[name])
            .map(name => ({ name, value: counts[name] }))
    }, [filteredData])

    return (
        <div className="container mx-auto px-4 py-8 space-y-10">
            <header className="space-y-8">
                <Link href={`/Topics/${topicName}`} className="flex items-center text-secondary-grey hover:text-primary transition-all gap-2 font-bold text-sm w-fit group">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Back to Companies
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/30 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                        <div className="p-6 bg-gradient-to-br from-primary to-primary/80 rounded-[28px] shadow-2xl shadow-primary/30 text-white transform hover:rotate-3 transition-transform duration-500">
                            <Building2 className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary-text font-space-grotesk">{companyName}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-primary/10">
                                    <Filter className="w-4 h-4" />
                                    <span>Field: {topicName}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 text-secondary-grey px-4 py-1.5 rounded-full text-sm font-bold">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Live Recruitment
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 relative z-10">
                        <div className="bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] text-secondary-grey font-black uppercase tracking-[0.2em] mb-1">Total Leads</span>
                            <span className="text-3xl font-black text-primary font-space-grotesk">{filteredData.length}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="rounded-2xl border-gray-200 font-bold hover:bg-gray-50">
                                <Download className="w-4 h-4 mr-2" />
                                Export List
                            </Button>
                            <Button variant="outline" className="rounded-2xl border-gray-200 font-bold hover:bg-gray-50">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share View
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Referral Sources Chart */}
                <Card className="rounded-[32px] border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-50">
                        <CardTitle className="text-lg font-bold font-space-grotesk">Referral Channels</CardTitle>
                        <CardDescription>Where {topicName} candidates are coming from</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={referralData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {referralData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Experience Distribution Chart */}
                <Card className="rounded-[32px] border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-50">
                        <CardTitle className="text-lg font-bold font-space-grotesk">Seniority Distribution</CardTitle>
                        <CardDescription>Experience levels in the {topicName} talent pool</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={experienceData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#BC002D"
                                    radius={[8, 8, 8, 8]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <main className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-bold text-primary-text font-space-grotesk flex items-center gap-3">
                        Candidate Analysis
                        <span className="text-sm font-medium text-secondary-grey bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            Refined by {topicName}
                        </span>
                    </h2>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden group/table">
                    <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-transparent flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-sm text-secondary-grey font-medium uppercase tracking-widest">Active Database</p>
                            <p className="text-xs text-gray-400">Total results matching your current criteria</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                            <Filter className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="p-2">
                        <DataTable data={filteredData} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CompanyDetailPage
