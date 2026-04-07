"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, MapPin, Users2 } from "lucide-react"
import { getCaseFileById } from "@/services/caseFilesService"
import { hourlyMilkVolumeData } from "@/lib/case-files-chart-data"
import { getMockLogData } from "@/lib/case-files-timeline-data"
import type { Note, CompletionEntry } from "@/types/case-files"
import {
  LogSheet,
  DetailModal,
  BabyModalContent,
  PumpingSessionsSection,
  Pp1ConsultChecklistModal,
  type PumpingSessionsTab,
} from "@/components/case-file-detail"
import {
  AtRiskConditionsCard,
  UrgentActionCard,
  InfantDataSection,
  MomDataSection,
} from "@/components/case-file-detail/cards"
import {
  getAtRiskConditionsCardData,
  getUrgentActionCardData,
  getInfantDataItems,
} from "@/lib/case-file-detail-cards-data"
import { getMomDataItems } from "@/lib/mom-data-cards-data"
import { mapInfantDataToCardItems } from "@/lib/infant-data-icons"
import { getCaseFileBackNavigation } from "@/lib/case-file-back-navigation"
import { cn } from "@/lib/utils"

const MOM_DATA_KNOW_MORE_SINGLE_TAB: Record<string, PumpingSessionsTab> = {
  "milk-trend-volume": "trend",
  "left-and-right": "leftRight",
  "recent-session": "recent",
}

const MOM_DATA_KNOW_MORE_MODAL_TITLE: Record<string, string> = {
  "milk-trend-volume": "Milk Volume Trend",
  "left-and-right": "Left vs Right",
  "recent-session": "Recent Sessions",
}

export default function CaseFileDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const backNav = getCaseFileBackNavigation(searchParams.get("from"))
  const patientId = pathname.split("/").pop() ?? ""
  const isMockProfile = patientId === "mock"

  const [patientNotes, setPatientNotes] = React.useState<Note[]>(() =>
    isMockProfile ? getMockLogData().patientNotes : []
  )
  const [completionLog, setCompletionLog] = React.useState<CompletionEntry[]>(() =>
    isMockProfile ? getMockLogData().completionLog : []
  )
  const [isLogOpen, setIsLogOpen] = React.useState(false)
  const [noteContext, setNoteContext] = React.useState<{ id: string; label: string } | null>(null)
  const [detailModal, setDetailModal] = React.useState<"baby" | null>(null)
  const [momDataKnowMoreId, setMomDataKnowMoreId] = React.useState<string | null>(null)
  const [pp1ChecklistOpen, setPp1ChecklistOpen] = React.useState(false)

  const mockPatient = getCaseFileById(patientId)

  // When navigating to the "mock" demo profile, load sample log data for the Log sheet.
  const prevPatientIdRef = React.useRef(patientId)
  React.useEffect(() => {
    if (prevPatientIdRef.current !== "mock" && patientId === "mock") {
      const mock = getMockLogData()
      setCompletionLog(mock.completionLog)
      setPatientNotes(mock.patientNotes)
    }
    prevPatientIdRef.current = patientId
  }, [patientId])

  const handleAddNote = (text: string, source: string) => {
    const newNote: Note = { id: Date.now().toString(), text, timestamp: new Date(), source }
    setPatientNotes((prev) => [...prev, newNote])
    setNoteContext(null)
  }

  const handleOpenLog = (item: { id: string; label: string } | null = null) => {
    setNoteContext(item)
    setIsLogOpen(true)
  }

  if (!mockPatient) {
    return (
      <div className="px-4 lg:px-6">
        <Button variant="ghost" size="sm" onClick={() => router.push(backNav.path)} className="mb-4">
          ← {backNav.label}
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

  const atRiskData = getAtRiskConditionsCardData(mockPatient)
  const urgentActionData = getUrgentActionCardData(mockPatient)
  const infantDataItems = React.useMemo(
    () => mapInfantDataToCardItems(getInfantDataItems(mockPatient)),
    [patientId]
  )
  const momDataItems = React.useMemo(() => getMomDataItems(mockPatient), [patientId])

  return (
    <div className="px-4 lg:px-6">
      <Button variant="ghost" size="sm" onClick={() => router.push(backNav.path)} className="mb-4">
        ← {backNav.label}
      </Button>

      {/* Summary card — at the very top */}
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
              <p className="text-sm text-muted-foreground">
                DOB{" "}
                <span className="font-medium text-foreground">
                  {(() => {
                    const [mm, dd, yyyy] = mockPatient.dateOfBirth.split("/").map(Number)
                    if ([mm, dd, yyyy].some(Number.isNaN)) return mockPatient.dateOfBirth
                    return new Date(yyyy, mm - 1, dd).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  })()}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Patient ID{" "}
                <Badge variant="secondary" className="font-mono text-xs font-normal">
                  {mockPatient.id === "mock" ? "PAT-MOCK-001" : mockPatient.id}
                </Badge>
              </p>
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
                  <h2 className="text-base font-semibold">{mockPatient.motherName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {mockPatient.motherAgeYears} years old · Baby: {mockPatient.motherLastName}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="text-xs font-normal">
                      Gravida {mockPatient.gravida ?? "—"}
                    </Badge>
                    <Badge
                      variant={mockPatient.riskFactor ? "outline" : "secondary"}
                      className={cn(
                        "text-xs font-normal",
                        mockPatient.riskFactor &&
                          "border-red-500/50 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200"
                      )}
                    >
                      {mockPatient.riskFactor ?? "—"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Alerts & metrics: urgent + at-risk only (two columns on large screens) */}
      <section className="space-y-4" aria-labelledby="alerts-metrics-heading">
        <h2 id="alerts-metrics-heading" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Alerts & metrics
        </h2>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {urgentActionData != null && (
            <UrgentActionCard
              data={urgentActionData}
              onChecklistClick={() => setPp1ChecklistOpen(true)}
            />
          )}
          {atRiskData != null && <AtRiskConditionsCard data={atRiskData} />}
        </div>
      </section>

      <Separator className="my-6" />

      {/* Full-width tinted card — same structure as Mom Data below */}
      <InfantDataSection items={infantDataItems} />

      <Separator className="my-6" />

      <MomDataSection items={momDataItems} onKnowMore={(id) => setMomDataKnowMoreId(id)} />

      {detailModal === "baby" && (
        <DetailModal title={`${mockPatient.motherLastName}, ${mockPatient.babyGender}`} onClose={() => setDetailModal(null)} dialogClassName="max-w-2xl">
          <BabyModalContent patient={mockPatient} />
        </DetailModal>
      )}

      {momDataKnowMoreId != null && (
        <DetailModal
          title={MOM_DATA_KNOW_MORE_MODAL_TITLE[momDataKnowMoreId] ?? "Pumping & volume"}
          onClose={() => setMomDataKnowMoreId(null)}
          dialogClassName="max-w-4xl w-[calc(100vw-2rem)]"
        >
          <PumpingSessionsSection
            singleTab={MOM_DATA_KNOW_MORE_SINGLE_TAB[momDataKnowMoreId] ?? "recent"}
          />
        </DetailModal>
      )}

      <LogSheet
        notes={patientNotes}
        completionLog={completionLog}
        noteContext={noteContext}
        onAddNote={handleAddNote}
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />

      <Pp1ConsultChecklistModal
        open={pp1ChecklistOpen}
        onOpenChange={setPp1ChecklistOpen}
      />
    </div>
  )
}
