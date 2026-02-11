"use client"
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Briefcase, Users, ArrowRight, TrendingUp, Search, Archive } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { toast } from 'sonner'

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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EXPERIENCE_LEVELS } from '@/lib/constants'

const TopicDetailPage = () => {
    const params = useParams()
    const topicName = decodeURIComponent(params.TopicName as string)

    const [companies, setCompanies] = useState<any[]>([])
    const [availableTopics, setAvailableTopics] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form state
    const [newCompanyName, setNewCompanyName] = useState("")
    const [selectedRoles, setSelectedRoles] = useState<{ name: string, experience: string }[]>([])
    const [roleSearch, setRoleSearch] = useState("")

    // Sync selectedRoles with current topic on mount or topic change
    useEffect(() => {
        setSelectedRoles([{ name: topicName, experience: '0-5' }])
    }, [topicName])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [companiesRes, topicsRes] = await Promise.all([
                fetch(`http://localhost:5000/api/companies?topic=${encodeURIComponent(topicName)}`),
                fetch('http://localhost:5000/api/topics')
            ])
            const companiesData = await companiesRes.json()
            const topicsData = await topicsRes.json()

            setCompanies(companiesData)
            setAvailableTopics(topicsData)
        } catch (error) {
            console.error("Failed to fetch topic data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [topicName])

    const handleArchiveCompany = async (e: React.MouseEvent, id: number) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const res = await fetch(`http://localhost:5000/api/companies/${id}/archive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ archive: true })
            })
            if (res.ok) {
                toast.success("Company archived successfully")
                setCompanies(prev => prev.filter(c => c.id !== id))
            }
        } catch (error) {
            console.error("Failed to archive company:", error)
            toast.error("Failed to archive company")
        }
    }

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCompanyName || selectedRoles.length === 0) return

        try {
            const response = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCompanyName,
                    roles: selectedRoles
                })
            })

            if (response.ok) {
                setIsDialogOpen(false)
                setNewCompanyName("")
                setSelectedRoles([{ name: topicName, experience: '0-5' }])
                fetchData() // Refresh list
            }
        } catch (error) {
            console.error("Failed to add company:", error)
        }
    }

    const toggleRole = (roleName: string) => {
        setSelectedRoles(prev => {
            const exists = prev.find(r => r.name === roleName);
            if (exists) {
                return prev.filter(r => r.name !== roleName);
            } else {
                return [...prev, { name: roleName, experience: '0-5' }];
            }
        });
    }

    const updateRoleExperience = (roleName: string, exp: string) => {
        setSelectedRoles(prev => prev.map(r => r.name === roleName ? { ...r, experience: exp } : r));
    }

    const filteredTopicsForModal = useMemo(() => {
        return availableTopics.filter(t =>
            t.name.toLowerCase().includes(roleSearch.toLowerCase())
        )
    }, [availableTopics, roleSearch])

    const displayTopicName = useMemo(() => topicName.split(' :')[0], [topicName])

    if (loading && companies.length === 0) {
        return <div className="min-h-screen bg-[#181B31] flex items-center justify-center text-white text-xl">Loading hub...</div>
    }

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
                        <h1 className="text-5xl font-black tracking-tight text-white font-space-grotesk leading-[1.1]">
                            {displayTopicName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-kaizen-red to-red-400">Hub</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            Discover industry leaders and open opportunities. Currently tracking <span className="text-white font-semibold">{companies.length} active employers</span> in the {displayTopicName} sector.
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl px-10 py-8 h-auto font-black bg-kaizen-red text-white shadow-[0_0_30px_rgba(188,0,45,0.3)] hover:shadow-[0_0_50px_rgba(188,0,45,0.5)] hover:scale-[1.05] border-none transition-all duration-300">
                                <Plus className="w-6 h-6 mr-3" />
                                Add Employer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[520px] w-[95vw] h-[85vh] max-h-[800px] bg-[#1c213e] border-gray-800 text-white rounded-[32px] shadow-2xl overflow-hidden p-0 !flex !flex-col">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-kaizen-red z-50" />
                            <form onSubmit={handleAddCompany} className="flex flex-col h-full overflow-hidden">
                                <DialogHeader className="px-8 pt-10 pb-6 flex-shrink-0 bg-gradient-to-b from-[#1c213e] to-[#1c213e]/95">
                                    <DialogTitle className="text-3xl font-black font-space-grotesk tracking-tight text-left">Register Employer</DialogTitle>
                                    <DialogDescription className="text-gray-400 text-base text-left mt-1">
                                        Initialize a new recruitment entity in the {displayTopicName} sector.
                                    </DialogDescription>
                                </DialogHeader>

                                <ScrollArea className="flex-1 min-h-0 bg-[#1c213e]">
                                    <div className="px-8 py-4 space-y-8 pb-12">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Organization Identity</Label>
                                            <Input
                                                id="name"
                                                value={newCompanyName}
                                                onChange={(e) => setNewCompanyName(e.target.value)}
                                                placeholder="e.g. Acme Corporation"
                                                className="rounded-2xl h-16 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-kaizen-red focus:ring-kaizen-red/20 text-lg font-medium px-6 transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="flex justify-between items-end">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Select Operating Roles</Label>
                                                <span className="text-[10px] font-bold text-kaizen-red bg-kaizen-red/10 px-2 py-0.5 rounded-md">{selectedRoles.length} Selected</span>
                                            </div>

                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <Input
                                                    placeholder="Search roles..."
                                                    value={roleSearch}
                                                    onChange={(e) => setRoleSearch(e.target.value)}
                                                    className="pl-12 h-14 bg-white/5 border-gray-800 rounded-2xl text-base placeholder:text-gray-600"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {filteredTopicsForModal.map((topic) => {
                                                    const role = selectedRoles.find(r => r.name === topic.name);
                                                    const isSelected = !!role;

                                                    return (
                                                        <div
                                                            key={topic.id}
                                                            className={`flex flex-col gap-4 p-5 rounded-[24px] transition-all border ${isSelected
                                                                ? 'bg-kaizen-red/10 border-kaizen-red/40 text-white shadow-[0_0_20px_rgba(188,0,45,0.1)]'
                                                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <Checkbox
                                                                    id={`role-${topic.id}`}
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => toggleRole(topic.name)}
                                                                    className="border-gray-600 data-[state=checked]:bg-kaizen-red data-[state=checked]:border-kaizen-red rounded-lg w-6 h-6"
                                                                />
                                                                <label
                                                                    htmlFor={`role-${topic.id}`}
                                                                    className="text-base font-bold cursor-pointer leading-tight flex-1 py-1"
                                                                >
                                                                    {topic.name}
                                                                </label>
                                                            </div>

                                                            {isSelected && (
                                                                <div className="pl-10 animate-in slide-in-from-top-2 duration-300">
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-[10px] font-black uppercase text-gray-500 shrink-0">Required Experience:</span>
                                                                        <Select
                                                                            value={role.experience}
                                                                            onValueChange={(val) => updateRoleExperience(topic.name, val)}
                                                                        >
                                                                            <SelectTrigger className="h-10 bg-white/5 border-gray-800 rounded-xl text-xs font-bold w-[140px]">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="bg-[#1c213e] border-gray-800 text-white rounded-xl">
                                                                                {EXPERIENCE_LEVELS.map(level => (
                                                                                    <SelectItem key={level.value} value={level.value} className="text-xs font-bold focus:bg-kaizen-red focus:text-white">
                                                                                        {level.label}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                <DialogFooter className="p-8 bg-black/40 border-t border-white/5 flex-shrink-0 z-10">
                                    <Button type="submit" className="w-full h-16 rounded-[20px] font-black text-xl bg-kaizen-red shadow-[0_10px_30px_rgba(188,0,45,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        Confirm Registration
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.length > 0 ? (
                        companies.map((company, i) => (
                            <Link key={i} href={`/Topics/${encodeURIComponent(topicName)}/${encodeURIComponent(company.name)}`} className="group outline-none">
                                <Card className="h-full border border-gray-800/50 shadow-2xl transition-all duration-700 bg-gradient-to-br from-[#1c213e]/80 to-[#181b31]/80 backdrop-blur-xl group-hover:bg-[#252a4d] group-hover:-translate-y-3 overflow-hidden relative rounded-[40px]">
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
                                                Key Role Alignments
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {company.roles.map((role: any, idx: number) => {
                                                    const roleName = typeof role === 'string' ? role : role.name;
                                                    const experience = typeof role === 'string' ? null : role.experience;
                                                    const isCurrentTopic = roleName === topicName;

                                                    return (
                                                        <span key={idx} className={`bg-white/5 border px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${isCurrentTopic ? 'border-kaizen-red/40 bg-kaizen-red/10 text-kaizen-red' : 'border-white/5 text-gray-400'
                                                            }`}>
                                                            {roleName.split(' (')[0].split(' :')[0]}
                                                            {experience && (
                                                                <span className="opacity-60 text-[8px] border-l border-white/10 pl-2">
                                                                    {experience}Y
                                                                </span>
                                                            )}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Active Roles</span>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5 text-kaizen-red" />
                                                    <span className="text-2xl font-black text-white tracking-tighter">
                                                        {company.roles.length}
                                                        <span className="text-sm font-normal text-gray-500 ml-2 tracking-normal">Positions</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={(e) => handleArchiveCompany(e, company.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-10 h-10 rounded-xl text-gray-500 hover:text-kaizen-red hover:bg-kaizen-red/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Archive className="w-5 h-5" />
                                                </Button>
                                                <div className="w-14 h-14 rounded-[20px] bg-kaizen-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 rotate-45 group-hover:rotate-0 shadow-2xl shadow-kaizen-red/40">
                                                    <ArrowRight className="w-7 h-7" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">No Employers Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Be the first to register an industry leader in the {displayTopicName} sector.</p>
                            <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="mt-4 border-gray-700 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl">
                                Add First Employer
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TopicDetailPage