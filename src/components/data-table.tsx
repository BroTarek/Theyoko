"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconBriefcase,
    IconBuilding,
    IconChartBar,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheck,
    IconCircleCheckFilled,
    IconCircleDot,
    IconCircleX,
    IconCpu,
    IconDotsVertical,
    IconGavel,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
    IconTrendingUp,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import Link from "next/link"

// Country data type
export type Country = {
    code: string
    name: string
}

// List of countries (you can expand this list as needed)
const COUNTRIES: Country[] = [
    { code: "SA", name: "Saudi Arabia" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "EG", name: "Egypt" },
    { code: "IQ", name: "Iraq" },
    { code: "JO", name: "Jordan" },
    { code: "LB", name: "Lebanon" },
    { code: "KW", name: "Kuwait" },
    { code: "QA", name: "Qatar" },
    { code: "BH", name: "Bahrain" },
    { code: "OM", name: "Oman" },
    { code: "SY", name: "Syria" },
    { code: "YE", name: "Yemen" },
    { code: "PS", name: "Palestine" },
    { code: "MA", name: "Morocco" },
    { code: "DZ", name: "Algeria" },
    { code: "TN", name: "Tunisia" },
    { code: "LY", name: "Libya" },
    { code: "SD", name: "Sudan" },
    { code: "SO", name: "Somalia" },
    { code: "MR", name: "Mauritania" },
    { code: "DJ", name: "Djibouti" },
    { code: "KM", name: "Comoros" },
]

// Update the schema to use country codes
export const schema = z.object({
    id: z.number(),
    header: z.string(),
    field: z.enum(["Sales", "Marketing", "Management", "IT", "Law", "Engineering"]),
    status: z.enum(["Unseen", "Seen", "Reviwed", "Selected", "In Process", "Done"]),
    experience: z.string(),
    countries: z.array(z.string()), // Array of country codes
})

// Field configuration with colors and icons
const FIELD_CONFIG = {
    Sales: {
        color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        icon: IconChartBar,
        iconColor: "text-red-600 dark:text-red-400"
    },
    Marketing: {
        color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        icon: IconBuilding,
        iconColor: "text-blue-600 dark:text-blue-400"
    },
    Management: {
        color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
        icon: IconBriefcase,
        iconColor: "text-purple-600 dark:text-purple-400"
    },
    IT: {
        color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        icon: IconCpu,
        iconColor: "text-green-600 dark:text-green-400"
    },
    Law: {
        color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        icon: IconGavel,
        iconColor: "text-amber-600 dark:text-amber-400"
    },
    Engineering: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
        icon: IconBriefcase,
        iconColor: "text-indigo-600 dark:text-indigo-400"
    }
} as const

// Status configuration with colors and icons
const STATUS_CONFIG = {
    Unseen: {
        color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
        icon: IconCircleDot,
        iconColor: "text-gray-500 dark:text-gray-400"
    },
    Seen: {
        color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        icon: IconCircleDot,
        iconColor: "text-blue-500 dark:text-blue-400"
    },
    Reviwed: {
        color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
        icon: IconCircleCheck,
        iconColor: "text-purple-500 dark:text-purple-400"
    },
    Selected: {
        color: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
        icon: IconCircleCheckFilled,
        iconColor: "text-green-500 dark:text-green-400"
    },
    "In Process": {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
        icon: IconLoader,
        iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    Done: {
        color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        icon: IconCircleCheckFilled,
        iconColor: "text-green-500 dark:text-green-400"
    }
} as const

// Country Select Component
function CountrySelect({
    value,
    onChange,
    id
}: {
    value: string[]
    onChange: (value: string[]) => void
    id?: string
}) {
    const [selectedCountries, setSelectedCountries] = React.useState<string[]>(value)

    // Filter COUNTRIES to only show countries that are in the current row's countries array
    const availableCountries = COUNTRIES.filter(country =>
        value.includes(country.code)
    )

    const handleChange = (countryCode: string) => {
        const newValue = selectedCountries.includes(countryCode)
            ? selectedCountries.filter(code => code !== countryCode)
            : [...selectedCountries, countryCode]

        setSelectedCountries(newValue)
        onChange(newValue)
    }

    return (
        <Select
            value=""
            onValueChange={(value) => {
                if (value && !selectedCountries.includes(value)) {
                    handleChange(value)
                }
            }}
        >
            <SelectTrigger
                className="w-full min-w-[200px] **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={id}
            >
                <SelectValue placeholder="Select countries">
                    {selectedCountries.length > 0 ? (
                        <div className="flex items-center gap-1">
                            {selectedCountries.map((code) => {
                                const country = COUNTRIES.find(c => c.code === code)
                                return (
                                    <div key={code} className="flex items-center gap-1">
                                        <img
                                            src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${code.toLowerCase()}.svg`}
                                            alt={country?.name || code}
                                            className="size-4 rounded object-cover"
                                            onError={(e) => {
                                                // Fallback if flag doesn't exist
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                        <span>{country?.name || code}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        "Select countries"
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" className="max-h-[300px] overflow-y-auto">
                {availableCountries.map((country) => (
                    <SelectItem
                        key={country.code}
                        value={country.code}
                        className="flex items-center gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${country.code.toLowerCase()}.svg`}
                                alt={country.name}
                                className="size-4 rounded object-cover"
                                onError={(e) => {
                                    // Fallback if flag doesn't exist
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                            <span>{country.name}</span>
                            {selectedCountries.includes(country.code) && (
                                <span className="ml-auto">✓</span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "header",
        header: "Header",
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "field",
        header: "Field",
        cell: ({ row }) => {
            const field = row.original.field
            const config = FIELD_CONFIG[field as keyof typeof FIELD_CONFIG]

            if (!config) {
                return (
                    <div className="w-32">
                        <Badge variant="outline" className="px-2">
                            {field}
                        </Badge>
                    </div>
                )
            }

            const Icon = config.icon

            return (
                <div className="w-32">
                    <Badge
                        variant="outline"
                        className={`px-2 ${config.color}`}
                    >
                        <Icon className={`size-3 mr-1 ${config.iconColor}`} />
                        {field}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            const config = STATUS_CONFIG[status]
            const Icon = config.icon

            return (
                <Badge
                    variant="outline"
                    className={`px-2 ${config.color}`}
                >
                    <Icon className={`size-3 mr-1 ${config.iconColor}`} />
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "experience",
        header: () => <div className="w-full text-right">Experience</div>,
        cell: ({ row }) => (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                        loading: `Saving ${row.original.header}`,
                        success: "Done",
                        error: "Error",
                    })
                }}
            >
                <Label htmlFor={`${row.original.id}-experience`} className="sr-only">
                    Experience
                </Label>
                <Input
                    className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
                    defaultValue={row.original.experience}
                    id={`${row.original.id}-experience`}
                />
            </form>
        ),
    },
    {
        accessorKey: "countries",
        header: "Countries",
        cell: ({ row }) => {
            const handleCountryChange = (newCountries: string[]) => {
                toast.promise(
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true)
                        }, 500)
                    }),
                    {
                        loading: `Updating countries for ${row.original.header}`,
                        success: "Countries updated successfully",
                        error: "Failed to update countries",
                    }
                )
            }

            return (
                <div className="min-w-[200px]">
                    <Label htmlFor={`${row.original.id}-countries`} className="sr-only">
                        Countries
                    </Label>
                    <CountrySelect
                        value={row.original.countries}
                        onChange={handleCountryChange}
                        id={`${row.original.id}-countries`}
                    />
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable({
    data: initialData,
}: {
    data: z.infer<typeof schema>[]
}) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    
      const [selectedExperience, setSelectedExperience] = React.useState<string>('');
      
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [fieldFilter, setFieldFilter] = React.useState<string>("all")

    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    // Filter data based on selected field
    const filteredData = React.useMemo(() => {
        if (fieldFilter === "all") {
            return data
        }
        return data.filter(item => item.field === fieldFilter)
    }, [data, fieldFilter])

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => filteredData?.map(({ id }) => id) || [],
        [filteredData]
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = data.findIndex(item => item.id === active.id)
                const newIndex = data.findIndex(item => item.id === over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    // Get unique fields for filter dropdown
    const uniqueFields = React.useMemo(() => {
        const fields = Array.from(new Set(data.map(item => item.field)))
        return fields.sort()
    }, [data])

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="field-filter" className="text-sm font-medium">
                            Filter by Field:
                        </Label>
                        <Select value={fieldFilter} onValueChange={setFieldFilter}>
                            <SelectTrigger
                                className="w-45"
                                size="sm"
                                id="field-filter"
                            >
                                <SelectValue placeholder="All Fields" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Fields</SelectItem>
                                {uniqueFields.map(field => {
                                    const config = FIELD_CONFIG[field as keyof typeof FIELD_CONFIG]
                                    return (
                                        <SelectItem key={field} value={field}>
                                            <div className="flex items-center gap-2">
                                                {config && config.icon && (
                                                    <config.icon className={`size-3 ${config.iconColor}`} />
                                                )}
                                                <span>{field}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <Label htmlFor="view-selector" className="sr-only">
                        View
                    </Label>
                    
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="w-full h-[50px] px-4 rounded-lg border border-gray-300 bg-white text-primary-text 
            focus:ring-2 focus:ring-kaizen-red/20 focus:border-kaizen-red
            hover:border-kaizen-red/60 transition-all duration-200
            data-[state=open]:border-kaizen-red data-[state=open]:ring-2 data-[state=open]:ring-kaizen-red/20">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg py-1 
            animate-in fade-in-80 zoom-in-95">
                  <SelectItem
                    value="0-5"
                    className="py-2.5 px-3 rounded-md cursor-pointer transition-colors duration-150
                hover:bg-red-50 hover:text-kaizen-red
                focus:bg-red-50 focus:text-kaizen-red
                data-[state=checked]:bg-red-50 data-[state=checked]:text-kaizen-red
                data-[state=checked]:font-medium"
                  >
                    0-5 years
                  </SelectItem>
                  <SelectItem
                    value="5-10"
                    className="py-2.5 px-3 rounded-md cursor-pointer transition-colors duration-150
                hover:bg-red-50 hover:text-kaizen-red
                focus:bg-red-50 focus:text-kaizen-red
                data-[state=checked]:bg-red-50 data-[state=checked]:text-kaizen-red
                data-[state=checked]:font-medium"
                  >
                    5-10 years
                  </SelectItem>
                  <SelectItem
                    value="10+"
                    className="py-2.5 px-3 rounded-md cursor-pointer transition-colors duration-150
                hover:bg-red-50 hover:text-kaizen-red
                focus:bg-red-50 focus:text-kaizen-red
                data-[state=checked]:bg-red-50 data-[state=checked]:text-kaizen-red
                data-[state=checked]:font-medium"
                  >
                    10+ years
                  </SelectItem>
                </SelectContent>
              </Select>
                </div>

                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id === "field" ? "Field" :
                                                column.id === "status" ? "Status" :
                                                    column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results found for selected field.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full fle`x-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--primary)",
    },
} satisfies ChartConfig
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
    const isMobile = useIsMobile()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="link" className="text-foreground w-fit px-0 text-left">
                {item.header}
            </Button>
        )
    }

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.header}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.header}</DrawerTitle>
                    <DrawerDescription>
                        Showing total visitors for the last 6 months
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col flex-1 gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            {/* Aspect ratio container ensures the space is reserved */}
                            <div className="w-full overflow-hidden rounded-lg bg-muted aspect-video flex items-center justify-center">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/67/Cristiano_Ronaldo_2275_%28cropped%29.jpg"
                                    alt="CR7"
                                    className="max-w-full max-h-full "
                                />
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month{" "}
                                    <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Showing total visitors for the last 6 months. This is just
                                    some random text to test the layout. It spans multiple lines
                                    and should wrap around.
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Header</Label>
                            <Input id="header" defaultValue={item.header} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Type</Label>
                                <Select defaultValue={item.field}>
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select a field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(FIELD_CONFIG).map(field => {
                                            const config = FIELD_CONFIG[field as keyof typeof FIELD_CONFIG]
                                            const Icon = config.icon
                                            return (
                                                <SelectItem key={field} value={field}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`size-3 ${config.iconColor}`} />
                                                        <span>{field}</span>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={item.status}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(STATUS_CONFIG).map(status => {
                                            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                                            const Icon = config.icon
                                            return (
                                                <SelectItem key={status} value={status}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`size-3 ${config.iconColor}`} />
                                                        <span>{status}</span>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="experience">Experience</Label>
                                <Input id="experience" defaultValue={item.experience} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="countries">Countries</Label>
                            <CountrySelect
                                value={item.countries}
                                onChange={(newCountries) => {
                                    toast.promise(
                                        new Promise((resolve) => setTimeout(resolve, 500)),
                                        {
                                            loading: "Updating countries...",
                                            success: "Countries updated!",
                                            error: "Failed to update countries",
                                        }
                                    )
                                }}
                            />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Link href={'/Portofolio'}>
                        <Button>
                            Visit Page
                        </Button>
                    </Link>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}