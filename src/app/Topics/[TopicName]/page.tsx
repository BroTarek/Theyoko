"use client"
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Briefcase, Users, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TopicDetailPage = () => {
    const params = useParams()
    const topicName = decodeURIComponent(params.TopicName as string)

    // Mock companies based on the topic
    const companies = useMemo(() => {
        const companyList = [
            { name: "GlobalTech Solutions" },
            { name: "Visionary Media" },
            { name: "Nova Financial" },
            { name: "Swift Logistics" },
            { name: "HealthSync" }
        ]

        // Randomly assign some titles based on the topic name for realism
        const fieldTitles: Record<string, string[]> = {
            "IT": ["Software Engineer", "DevOps Specialist", "System Architect", "Full Stack Dev"],
            "Marketing": ["Marketing Manager", "SEO Specialist", "Content Strategist", "Brand Lead"],
            "Sales": ["Account Executive", "Sales Manager", "Business Development", "SDR"],
            "Law": ["Legal Counsel", "Compliance Officer", "Paralegal", "Contract Spec"],
            "Visual": ["UI Designer", "Graphic Artist", "Motion Designer", "Identity Studio"],
            "Financial": ["Accountant", "Finance Manager", "Auditor", "Wealth Advisor"],
            "Management": ["Project Manager", "Team Lead", "Operations Director", "Coo"],
            "Research": ["Data Scientist", "Market Researcher", "Lab Analyst", "R&D Lead"]
        }

        const basicTitles = fieldTitles[topicName] || ["Specialist", "Manager", "Coordinator", "Lead"]

        return companyList.map(c => ({
            ...c,
            titles: [
                basicTitles[Math.floor(Math.random() * basicTitles.length)],
                basicTitles[Math.floor(Math.random() * basicTitles.length)]
            ].filter((v, i, a) => a.indexOf(v) === i),
            applicants: Math.floor(Math.random() * 50) + 10
        }))
    }, [topicName])

    return (
        <div className="min-h-screen bg-[#181B31] py-12 transition-colors duration-500">
            <div className="container mx-auto px-4 space-y-12">
                <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
                    <div className="space-y-4">
                        <nav className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase">
                            <Link href="/Topics" className="text-gray-400 hover:text-kaizen-red transition-colors">Topics</Link>
                            <span className="text-gray-600">/</span>
                            <span className="text-kaizen-red">{topicName}</span>
                        </nav>
                        <h1 className="text-5xl font-black tracking-tight text-white font-space-grotesk">
                            {topicName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kaizen-red to-red-400">Hub</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            Discover industry leaders and open opportunities. Currently tracking <span className="text-white font-semibold">{companies.length} active employers</span> in the {topicName} sector.
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl px-10 py-8 h-auto font-black bg-kaizen-red text-white shadow-[0_0_30px_rgba(188,0,45,0.3)] hover:shadow-[0_0_50px_rgba(188,0,45,0.5)] hover:scale-[1.05] border-none transition-all duration-300">
                                <Plus className="w-6 h-6 mr-3" />
                                Add Employer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-[#1c213e] border-gray-800 text-white rounded-[32px] shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-kaizen-red" />
                            <DialogHeader className="pt-4">
                                <DialogTitle className="text-2xl font-bold font-space-grotesk">Add New Card</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Expand the {topicName} network with a new recruitment entry.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Organization Name</Label>
                                    <Input id="name" placeholder="Acme International" className="rounded-xl h-14 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-kaizen-red focus:ring-kaizen-red/20" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="titles" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Key Positions</Label>
                                    <Input id="titles" placeholder="Lead, Senior Engineer..." className="rounded-xl h-14 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-kaizen-red focus:ring-kaizen-red/20" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full h-14 rounded-2xl font-black bg-kaizen-red shadow-xl shadow-kaizen-red/20">Finalize Entry</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company, i) => (
                        <Link key={i} href={`/Topics/${topicName}/${company.name}`} className="group outline-none">
                            <Card className="h-full border border-gray-800/50 shadow-2xl transition-all duration-700 bg-gradient-to-br from-[#1c213e]/80 to-[#181b31]/80 backdrop-blur-xl group-hover:bg-[#252a4d] group-hover:-translate-y-3 overflow-hidden relative rounded-[40px]">
                                {/* Animated flare effect */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-kaizen-red/10 rounded-full blur-[80px] group-hover:bg-kaizen-red/20 transition-all duration-700" />

                                <CardHeader className="relative pb-0 pt-10 px-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-5 bg-white/5 w-fit rounded-[24px] border border-white/5 group-hover:bg-kaizen-red group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                                            <Building2 className="w-8 h-8 text-kaizen-red group-hover:text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 bg-kaizen-red/10 text-kaizen-red border border-kaizen-red/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            Active
                                        </div>
                                    </div>
                                    <CardTitle className="text-3xl font-black text-white group-hover:text-kaizen-red transition-colors font-space-grotesk leading-tight">
                                        {company.name}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-8 p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <Briefcase className="w-4 h-4 text-kaizen-red" />
                                            Demand Insight
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {company.titles.map((title, idx) => (
                                                <span key={idx} className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl text-xs font-bold text-gray-300 group-hover:border-white/10 group-hover:bg-white/10 transition-all">
                                                    {title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Available Talent</span>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-kaizen-red" />
                                                <span className="text-2xl font-black text-white tracking-tighter">
                                                    {company.applicants}
                                                    <span className="text-sm font-normal text-gray-500 ml-2 tracking-normal">Matches</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 rounded-[20px] bg-kaizen-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 rotate-45 group-hover:rotate-0 shadow-2xl shadow-kaizen-red/40">
                                            <ArrowRight className="w-7 h-7" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TopicDetailPage