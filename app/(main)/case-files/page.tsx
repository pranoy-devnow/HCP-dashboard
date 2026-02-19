"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FolderOpen, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { caseFiles, babyTitle } from "@/lib/case-files-data"
import { formatAgeLive } from "@/lib/time-since-birth"

const patientNames = Array.from(new Set(caseFiles.map((file) => babyTitle(file)))).sort()

export default function CaseFilesListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [patientFilter, setPatientFilter] = React.useState<string>("all")
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const filteredCaseFiles = React.useMemo(() => {
    let files = caseFiles
    if (patientFilter !== "all") {
      files = files.filter((file) => babyTitle(file) === patientFilter)
    }
    if (!searchQuery.trim()) return files
    const query = searchQuery.toLowerCase()
    return files.filter(
      (file) =>
        babyTitle(file).toLowerCase().includes(query) ||
        file.motherName.toLowerCase().includes(query) ||
        `${file.location.room} ${file.location.bed}`.toLowerCase().includes(query)
    )
  }, [searchQuery, patientFilter])

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Case Files</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:w-[420px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by baby or mother name, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[420px]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-muted-foreground">Baby</span>
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="All babies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All babies</SelectItem>
                {patientNames.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCaseFiles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No case files found matching your search.
            </div>
          ) : (
            filteredCaseFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => router.push(`/case-files/${file.id}`)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 p-4 bg-background border rounded-lg",
                  "hover:border-primary/50 hover:shadow-md transition-all text-left",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <FolderOpen className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {babyTitle(file)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mother: {file.motherName} · Room {file.location.room}, Bed {file.location.bed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                  <Badge variant="secondary" className="tabular-nums font-medium shrink-0">
                    Age: {formatAgeLive(file.dateOfBirth, file.birthTime, now)}
                  </Badge>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      file.status === "High priority"
                        ? "bg-red-500/15 text-red-600 dark:text-red-400"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {file.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
