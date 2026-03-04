"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, MapPin, Users2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCaseFileById } from "@/services/caseFilesService"
import { formatAgeLive } from "@/lib/time-since-birth"
import { getHoursSinceBirth, getCurrentSectionKey } from "@/lib/case-file-detail-helpers"
import { hourlyMilkVolumeData } from "@/lib/case-files-chart-data"
import { TIMELINE_SECTIONS } from "@/types/case-files"
import {
  timelineChecklists,
  getAllTimelineItemIds,
  getMockLogData,
} from "@/lib/case-files-timeline-data"
import { CURRENT_USER_NAME } from "@/lib/constants"
import type { Note, CompletionEntry } from "@/types/case-files"
import {
  LogSheet,
  DetailModal,
  TimelineBlock,
  MotherModalContent,
  BabyModalContent,
} from "@/components/case-file-detail"

export default function CaseFileDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionFromUrl = searchParams.get("section") ?? null
  const itemFromUrl = searchParams.get("item") ?? null
  const fromFromUrl = searchParams.get("from") ?? null
  const backToNotifications = fromFromUrl === "notifications"
  const patientId = pathname.split("/").pop() ?? ""
  const isMockProfile = patientId === "mock"

  const [patientNotes, setPatientNotes] = React.useState<Note[]>(() =>
    isMockProfile ? getMockLogData().patientNotes : []
  )
  const [completionLog, setCompletionLog] = React.useState<CompletionEntry[]>(() =>
    isMockProfile ? getMockLogData().completionLog : []
  )
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(() =>
    isMockProfile ? getAllTimelineItemIds() : new Set()
  )
  const [skippedIds, setSkippedIds] = React.useState<Set<string>>(() => new Set())
  const [isLogOpen, setIsLogOpen] = React.useState(false)
  const [noteContext, setNoteContext] = React.useState<{ id: string; label: string } | null>(null)
  const [detailModal, setDetailModal] = React.useState<"mother" | "baby" | null>(null)

  const mockPatient = getCaseFileById(patientId)
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // When navigating from another case to the "mock" demo profile, load its pre-filled completed timeline and log so the demo looks realistic without requiring the user to complete every item.
  const prevPatientIdRef = React.useRef(patientId)
  React.useEffect(() => {
    if (prevPatientIdRef.current !== "mock" && patientId === "mock") {
      setCompletedIds(getAllTimelineItemIds())
      const mock = getMockLogData()
      setCompletionLog(mock.completionLog)
      setPatientNotes(mock.patientNotes)
    }
    prevPatientIdRef.current = patientId
  }, [patientId])

  React.useEffect(() => {
    if (!itemFromUrl) return
    const el = document.getElementById(`timeline-item-${itemFromUrl}`)
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 300)
      return () => clearTimeout(t)
    }
  }, [sectionFromUrl, itemFromUrl])

  const handleAddNote = (text: string, source: string) => {
    const newNote: Note = { id: Date.now().toString(), text, timestamp: new Date(), source }
    setPatientNotes((prev) => [...prev, newNote])
    setNoteContext(null)
  }

  const handleMarkCompleted = (itemId: string, itemLabel: string) => {
    setCompletedIds((prev) => new Set(prev).add(itemId))
    setCompletionLog((prev) => [
      ...prev,
      { id: Date.now().toString(), by: CURRENT_USER_NAME, itemLabel, timestamp: new Date() },
    ])
  }

  const handleSkip = (itemId: string) => {
    setSkippedIds((prev) => new Set(prev).add(itemId))
  }

  const handleOpenLog = (item: { id: string; label: string } | null = null) => {
    setNoteContext(item)
    setIsLogOpen(true)
  }

  if (!mockPatient) {
    return (
      <div className="px-4 lg:px-6">
        <Button variant="ghost" size="sm" onClick={() => router.push(backToNotifications ? "/notifications" : "/case-files")} className="mb-4">
          {backToNotifications ? "← Back to Notifications" : "← Back to Case Files"}
        </Button>
        <Card className="mb-6">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-medium">Case file not found</p>
            <p className="text-sm mt-1">No patient record for this ID. It may have been removed or the link is incorrect.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const realHoursSinceBirth = getHoursSinceBirth(mockPatient.dateOfBirth, mockPatient.birthTime, now)
  // Demo: cycle 0–24h so the "current" timeline section always stays in view; each baby has a different birth time so they land in different sections. For production, use realHoursSinceBirth and drop the modulo so that after 24h the timeline shows "24h+" and no section is current.
  const hoursSinceBirth = realHoursSinceBirth >= 24 ? realHoursSinceBirth % 24 : realHoursSinceBirth
  const currentSectionKey = getCurrentSectionKey(hoursSinceBirth)
  const ageDisplayForCard = (() => {
    const h = Math.floor(hoursSinceBirth)
    const m = Math.round((hoursSinceBirth - h) * 60)
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  })()

  return (
    <div className="px-4 lg:px-6">
      <Button variant="ghost" size="sm" onClick={() => router.push(backToNotifications ? "/notifications" : "/case-files")} className="mb-4">
        {backToNotifications ? "← Back to Notifications" : "← Back to Case Files"}
      </Button>

      <Card className="mb-6">
        <CardContent className="py-5 px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-0">
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 lg:border-r lg:pr-6 lg:border-border">
              <button
                type="button"
                onClick={() => setDetailModal("baby")}
                className="inline-flex items-center gap-2 text-left cursor-pointer hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm w-fit"
              >
                <Users2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{mockPatient.motherLastName}, {mockPatient.babyGender}</h3>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </button>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Gestational age</dt>
                <dd className="font-medium">{mockPatient.gestationalAgeWeeks}w</dd>
                <dt className="text-muted-foreground">Chronological</dt>
                <dd className="font-medium">{ageDisplayForCard}</dd>
                <dt className="text-muted-foreground">Corrected age</dt>
                <dd className="font-medium">{ageDisplayForCard}</dd>
                <dt className="text-muted-foreground">Birth weight</dt>
                <dd className="font-medium">{mockPatient.birthWeight}</dd>
                <dt className="text-muted-foreground">Current weight</dt>
                <dd className="font-medium">{mockPatient.currentWeight}</dd>
              </dl>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 lg:border-r lg:px-6 lg:border-border">
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Mom location</p>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>Room {mockPatient.location.room}, Bed {mockPatient.location.bed}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Baby location</p>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>Room {mockPatient.babyLocation.room}, Bed {mockPatient.babyLocation.bed}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:pl-6">
              <div className="flex items-start gap-4">
                <div className="min-w-0 space-y-1">
                  <button
                    type="button"
                    onClick={() => setDetailModal("mother")}
                    className="inline-flex items-center gap-1.5 text-left cursor-pointer hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  >
                    <h2 className="text-base font-semibold">{mockPatient.motherName}</h2>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {mockPatient.motherAgeYears} years old · Baby: {mockPatient.motherLastName}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="font-mono text-xs font-normal">
                      {mockPatient.id === "mock" ? "PAT-MOCK-001" : mockPatient.id}
                    </Badge>
                    <Badge
                      variant={mockPatient.status === "Active" ? "default" : "secondary"}
                      className={cn(
                        "text-xs font-normal",
                        mockPatient.status === "High priority" && "bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/25 dark:text-red-400 dark:border-red-500/30"
                      )}
                    >
                      {mockPatient.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {detailModal === "mother" && (
        <DetailModal title={mockPatient.motherName} onClose={() => setDetailModal(null)} dialogClassName="max-w-2xl" sessionCount={hourlyMilkVolumeData.length}>
          <MotherModalContent />
        </DetailModal>
      )}

      {detailModal === "baby" && (
        <DetailModal title={`${mockPatient.motherLastName}, ${mockPatient.babyGender}`} onClose={() => setDetailModal(null)} dialogClassName="max-w-2xl">
          <BabyModalContent patient={mockPatient} />
        </DetailModal>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
            <CardTitle className="shrink-0">Care Timeline</CardTitle>
            {!isMockProfile && (
              <span className="text-sm text-muted-foreground font-normal tabular-nums">
                {formatAgeLive(mockPatient.dateOfBirth, mockPatient.birthTime, now)}
              </span>
            )}
            <CardAction className="ml-auto shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleOpenLog(null)}>
                Log
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {TIMELINE_SECTIONS.map((timeRange) => (
              <TimelineBlock
                key={timeRange}
                timeRange={timeRange}
                items={timelineChecklists[timeRange]}
                defaultOpen={false}
                isCurrentSection={!isMockProfile && currentSectionKey === timeRange}
                onOpenNotes={(item, isGeneral) => handleOpenLog(isGeneral ? null : item)}
                onMarkCompleted={handleMarkCompleted}
                onSkip={handleSkip}
                isNotesOpen={isLogOpen}
                completedIds={completedIds}
                skippedIds={skippedIds}
              />
            ))}
          </div>
          <LogSheet
            notes={patientNotes}
            completionLog={completionLog}
            noteContext={noteContext}
            onAddNote={handleAddNote}
            isOpen={isLogOpen}
            onClose={() => setIsLogOpen(false)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
