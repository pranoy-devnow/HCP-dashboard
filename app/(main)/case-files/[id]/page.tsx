"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "radix-ui"
import { ArrowUpRight, ChevronDown, ChevronRight, ChevronUp, MapPin, Users2, X } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { getPatientData } from "@/lib/case-files-data"
import { formatAgeLive, getBirthDate } from "@/lib/time-since-birth"

// Mock data for mother modal charts (session index used in tooltip)
const hourlyMilkVolumeData = [
  { hour: "06:00", volume: 25, session: 1 },
  { hour: "08:00", volume: 52, session: 2 },
  { hour: "10:00", volume: 78, session: 3 },
  { hour: "12:00", volume: 50, session: 4 },
  { hour: "14:00", volume: 15, session: 5 },
  { hour: "16:00", volume: 54, session: 6 },
  { hour: "18:00", volume: 88, session: 7 },
  { hour: "20:00", volume: 48, session: 8 },
  { hour: "22:00", volume: 32, session: 9 },
]

function getVolumeBarColor(volume: number): string {
  if (volume <= 35) return "hsl(0 70% 52%)"   // red – low
  if (volume <= 65) return "hsl(220 70% 55%)" // blue – middle
  return "hsl(142 60% 42%)"                    // green – high
}

const leftVsRightData = [
  { time: "18:00", left: 58, right: 55 },
  { time: "22:00", left: 46, right: 48 },
  { time: "06:00", left: 50, right: 47 },
  { time: "10:00", left: 49, right: 51 },
  { time: "14:00", left: 48, right: 50 },
  { time: "18:00", left: 46, right: 47 },
  { time: "22:00", left: 47, right: 48 },
]

const hourlyChartConfig = {
  volume: { label: "Milk (ml)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const leftRightChartConfig = {
  left: { label: "Left Breast (ml)", color: "hsl(350 70% 65%)" },
  right: { label: "Right Breast (ml)", color: "hsl(270 60% 60%)" },
} satisfies ChartConfig

// Fenton growth chart: weight-for-age percentile curves (approximate, 30–40 weeks PMA)
const fentonWeightData = [
  { week: 30, p3: 0.9, p10: 1.0, p50: 1.3, p90: 1.6, p97: 1.8 },
  { week: 31, p3: 1.0, p10: 1.1, p50: 1.4, p90: 1.75, p97: 2.0 },
  { week: 32, p3: 1.1, p10: 1.2, p50: 1.6, p90: 2.0, p97: 2.2 },
  { week: 33, p3: 1.2, p10: 1.35, p50: 1.8, p90: 2.2, p97: 2.5 },
  { week: 34, p3: 1.4, p10: 1.5, p50: 2.0, p90: 2.5, p97: 2.8 },
  { week: 35, p3: 1.55, p10: 1.7, p50: 2.2, p90: 2.75, p97: 3.1 },
  { week: 36, p3: 1.7, p10: 1.9, p50: 2.4, p90: 3.0, p97: 3.3 },
  { week: 37, p3: 1.85, p10: 2.05, p50: 2.6, p90: 3.25, p97: 3.6 },
  { week: 38, p3: 2.0, p10: 2.2, p50: 2.8, p90: 3.5, p97: 3.9 },
  { week: 39, p3: 2.15, p10: 2.35, p50: 3.0, p90: 3.75, p97: 4.15 },
  { week: 40, p3: 2.3, p10: 2.5, p50: 3.2, p90: 4.0, p97: 4.4 },
]

const fentonChartConfig = {
  p3: { label: "3rd %ile", color: "hsl(350 70% 60%)" },
  p10: { label: "10th %ile", color: "hsl(25 90% 55%)" },
  p50: { label: "50th %ile (Median)", color: "hsl(220 80% 50%)" },
  p90: { label: "90th %ile", color: "hsl(25 90% 55%)" },
  p97: { label: "97th %ile", color: "hsl(350 70% 60%)" },
  baby: { label: "Baby", color: "hsl(270 60% 55%)" },
} satisfies ChartConfig

function parseWeightKg(weightStr: string): number {
  const match = weightStr.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

function postmenstrualAgeWeeks(gestationalWeeks: number, ageStr: string): number {
  const daysMatch = ageStr.match(/(\d+)\s*days?/i)
  const weeksMatch = ageStr.match(/(\d+)\s*weeks?/i)
  if (daysMatch) return gestationalWeeks + parseInt(daysMatch[1], 10) / 7
  if (weeksMatch) return gestationalWeeks + parseInt(weeksMatch[1], 10)
  return gestationalWeeks
}

/** Hours since birth; 0 if birth is in the future. */
function getHoursSinceBirth(dateOfBirth: string, birthTime: string, now: Date = new Date()): number {
  const birth = getBirthDate(dateOfBirth, birthTime)
  if (!birth) return 0
  const ms = now.getTime() - birth.getTime()
  return Math.max(0, ms / (1000 * 60 * 60))
}

/** Human-readable "Xh Ym since birth". */
function getTimeSinceBirthString(dateOfBirth: string, birthTime: string, now: Date = new Date()): string {
  const hours = getHoursSinceBirth(dateOfBirth, birthTime, now)
  if (hours < 0) return "Not yet born"
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h >= 24) return "24h+ since birth"
  if (m === 0) return `${h}h since birth`
  return `${h}h ${m}m since birth`
}

/** Format a decimal number of hours (0–24) as "Xh Ym since birth". Used with cycled demo value. */
function formatHoursSinceBirth(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (m === 0) return `${h}h since birth`
  return `${h}h ${m}m since birth`
}

const TIMELINE_SECTIONS = ["0-6", "6-12", "12-18", "18-24"] as const
type TimelineSectionKey = (typeof TIMELINE_SECTIONS)[number]

/** Which care timeline section is "current" for this many hours since birth. */
function getCurrentSectionKey(hoursSinceBirth: number): TimelineSectionKey | null {
  if (hoursSinceBirth < 0) return null
  if (hoursSinceBirth < 6) return "0-6"
  if (hoursSinceBirth < 12) return "6-12"
  if (hoursSinceBirth < 18) return "12-18"
  if (hoursSinceBirth < 24) return "18-24"
  return null
}

const CURRENT_USER_NAME = "Jake"

type Note = {
  id: string
  text: string
  timestamp: Date
  source: string
}

type CompletionEntry = {
  id: string
  by: string
  itemLabel: string
  timestamp: Date
}

type LogEntry =
  | { type: "completed"; id: string; by: string; itemLabel: string; timestamp: Date }
  | { type: "note"; id: string; text: string; source: string; timestamp: Date }

type TimelineItem = {
  id: string
  label: string
  checked: boolean
  description: string
  subItems?: Array<{ id: string; label: string; checked: boolean; description: string }>
  hideCheckbox?: boolean
}

const timelineChecklists: Record<string, TimelineItem[]> = {
  "0-6": [
    {
      id: "1",
      label: "MOM conversation",
      checked: false,
      description: "Initial conversation with the mother to establish rapport and understand her situation.",
      hideCheckbox: true,
      subItems: [
        { id: "1a", label: "Build rapport and create a calm, supportive space", checked: false, description: "" },
        { id: "1b", label: "Understand the mother's situation, feelings, and experience", checked: false, description: "" },
        { id: "1c", label: "Explain next steps and reassure ongoing support", checked: false, description: "" },
      ],
    },
    {
      id: "2",
      label: "Confirm case (Validate patient willingness)",
      checked: false,
      description: "Validate the patient's willingness to participate in the care plan and pumping protocol.",
      hideCheckbox: true,
      subItems: [
        { id: "2a", label: "Confirm willingness to participate", checked: false, description: "" },
        { id: "2b", label: "Ensure understanding and readiness of the pumping plan", checked: false, description: "" },
        { id: "2c", label: "Address concerns and confirm agreement", checked: false, description: "" },
      ],
    },
    {
      id: "3",
      label: "Pump preparation checklist",
      hideCheckbox: true,
      checked: false,
      description: "Pump Preparation Checklist",
      subItems: [
        { id: "3a", label: "Use a hospital-grade electric breast pump", checked: false, description: "" },
        { id: "3b", label: "Select the correct breast shield size", checked: false, description: "" },
        { id: "3c", label: "Set suction to a comfortable level", checked: false, description: "" },
        { id: "3d", label: "Prepare for double pumping if available", checked: false, description: "" },
        { id: "3e", label: "Check milk is flowing effectively", checked: false, description: "" },
      ],
    },
    {
      id: "4",
      label: "First pump: assisted checklist",
      checked: false,
      description: "Support mother through her first pumping session.",
      hideCheckbox: true,
      subItems: [
        { id: "4a", label: "Keep information simple and avoid overwhelming the mother", checked: false, description: "" },
        { id: "4b", label: "Support first pumping within 6 hours after birth", checked: false, description: "" },
        { id: "4c", label: "Stay with the mother during the entire first pumping session", checked: false, description: "" },
        { id: "4d", label: "Explain normal sensations during pumping", checked: false, description: "" },
        { id: "4e", label: "Log first pumping session data", checked: false, description: "" },
        { id: "4f", label: "Note mother's health and feelings about pumping", checked: false, description: "" },
        { id: "4g", label: "Plan the next pumping session if possible", checked: false, description: "" },
      ],
    },
    {
      id: "5",
      label: "Prepare for first consultation with mother",
      checked: false,
      description: "Pre-Consultation Checklist",
      hideCheckbox: true,
      subItems: [
        { id: "5a", label: "Review NICU Mother app (to assist mothers with logging pumping data later)", checked: false, description: "" },
        { id: "5b", label: "Review PP1 checklist", checked: false, description: "" },
      ],
    },
  ],
  "6-12": [
    {
      id: "6",
      label: "App Activation",
      checked: false,
      description: "App Activation",
      hideCheckbox: true,
      subItems: [
        { id: "6a", label: "Send activation link for NICU Mom app", checked: false, description: "" },
        { id: "6b", label: "Confirm mother can access and use the app", checked: false, description: "" },
      ],
    },
    {
      id: "7",
      label: "Introduce Pumping Pathway",
      checked: false,
      description: "Introduce Pumping Pathway",
      hideCheckbox: true,
      subItems: [
        { id: "7a", label: "Explain the pumping journey and what to expect", checked: false, description: "" },
        { id: "7b", label: "Set simple expectations for getting started", checked: false, description: "" },
      ],
    },
    {
      id: "8",
      label: "Milk Volume Expectations",
      checked: false,
      description: "Milk Volume Expectations",
      hideCheckbox: true,
      subItems: [
        { id: "8a", label: "Explain milk volume increases gradually", checked: false, description: "" },
        { id: "8b", label: "Clarify efficiency improves during first 14 days", checked: false, description: "" },
      ],
    },
    {
      id: "9",
      label: "MOM Volume Targets",
      checked: false,
      description: "MOM Volume Targets",
      hideCheckbox: true,
      subItems: [
        { id: "9a", label: "Explain milk needed for infant feeding", checked: false, description: "" },
        { id: "9b", label: "Explain milk needed to establish long-term milk production (≈ 500 mL/day by day 14)", checked: false, description: "" },
      ],
    },
    {
      id: "10",
      label: "First 14 Days Education",
      checked: false,
      description: "First 14 Days Education",
      hideCheckbox: true,
      subItems: [
        { id: "10a", label: "Explain importance of first 14 postpartum days", checked: false, description: "" },
        { id: "10b", label: "Emphasize early pumping supports milk supply", checked: false, description: "" },
      ],
    },
    {
      id: "11",
      label: "Pump Training",
      checked: false,
      description: "Pump Training",
      hideCheckbox: true,
      subItems: [
        { id: "11a", label: "Teach pump basics and safe use", checked: false, description: "" },
        { id: "11b", label: "Guide correct assembly and sizing", checked: false, description: "" },
        { id: "11c", label: "Explain how to use pump programs", checked: false, description: "" },
      ],
    },
    {
      id: "12",
      label: "Pump Access & Equipment",
      checked: false,
      description: "Pump Access & Equipment",
      hideCheckbox: true,
      subItems: [
        { id: "12a", label: "Explain need for hospital-grade electric pump", checked: false, description: "" },
        { id: "12b", label: "Help mother arrange access if needed", checked: false, description: "" },
      ],
    },
    {
      id: "13",
      label: "Pump Operation",
      checked: false,
      description: "Pump Operation",
      hideCheckbox: true,
      subItems: [
        { id: "13a", label: "Demonstrate pump setup", checked: false, description: "" },
        { id: "13b", label: "Show how to start pumping program", checked: false, description: "" },
        { id: "13c", label: "Explain when to use different pump modes", checked: false, description: "" },
      ],
    },
    {
      id: "14",
      label: "Breast Assessment Before Pumping",
      checked: false,
      description: "Breast Assessment Before Pumping",
      hideCheckbox: true,
      subItems: [
        { id: "14a", label: "Perform breast and nipple assessment before pumping", checked: false, description: "" },
        { id: "14b", label: "Teach mother how to identify the nipple base", checked: false, description: "" },
        { id: "14c", label: "Explain signs to report immediately (redness, tenderness, irritation)", checked: false, description: "" },
        { id: "14d", label: "Show how to report issues in the app", checked: false, description: "" },
      ],
    },
    {
      id: "15",
      label: "Breast Shield Size Personalisation",
      checked: false,
      description: "Breast Shield Size Personalisation",
      hideCheckbox: true,
      subItems: [
        { id: "15a", label: "Assess nipple size and check for areolar edema", checked: false, description: "" },
        { id: "15b", label: "Confirm correct shield fit (≤ 1/8 inch areola drawn into tunnel)", checked: false, description: "" },
        { id: "15c", label: "Explain shield size may change during first 14 days", checked: false, description: "" },
        { id: "15d", label: "Educate warning signs requiring size change (pain, redness, skin breakdown)", checked: false, description: "" },
        { id: "15e", label: "Record personalized shield size: Right: ____ mm | Left: ____ mm", checked: false, description: "" },
      ],
    },
    {
      id: "16",
      label: "Assisted Pumping Session",
      checked: false,
      description: "Assisted Pumping Session",
      hideCheckbox: true,
      subItems: [
        { id: "16a", label: "Teach double pumping for efficiency", checked: false, description: "" },
        { id: "16b", label: "Stay with mother during first pumping session", checked: false, description: "" },
        { id: "16c", label: "Explain normal pumping sensations", checked: false, description: "" },
        { id: "16d", label: "Assist mother in measuring and logging milk volume", checked: false, description: "" },
        { id: "16e", label: "Check shield positioning and nipple centering", checked: false, description: "" },
        { id: "16f", label: "Ensure shield pressure is not pushed into breast tissue", checked: false, description: "" },
      ],
    },
    {
      id: "17",
      label: "Vacuum Pressure Personalisation",
      checked: false,
      description: "Vacuum Pressure Personalisation",
      hideCheckbox: true,
      subItems: [
        { id: "17a", label: "Help mother find maximum comfortable vacuum level", checked: false, description: "" },
        { id: "17b", label: "Record personalized vacuum: ____", checked: false, description: "" },
        { id: "17c", label: "Explain pressure may change daily", checked: false, description: "" },
        { id: "17d", label: "Teach mother how to adjust settings in the app", checked: false, description: "" },
        { id: "17e", label: "Explain risks of too much or too little pressure", checked: false, description: "" },
      ],
    },
    {
      id: "18",
      label: "Post-Pumping Assessment",
      checked: false,
      description: "Post-Pumping Assessment",
      hideCheckbox: true,
      subItems: [
        { id: "18a", label: "Observe post-pumping breast and nipple condition", checked: false, description: "" },
        { id: "18b", label: "Check for pain, redness, or skin changes", checked: false, description: "" },
      ],
    },
    {
      id: "19",
      label: "Personalized Pumping Plan",
      checked: false,
      description: "Personalized Pumping Plan",
      hideCheckbox: true,
      subItems: [
        { id: "19a", label: "Agree on pumping frequency (minimum 5, ideally 8 times/day)", checked: false, description: "" },
        { id: "19b", label: "Explain normal body responses during pumping", checked: false, description: "" },
        { id: "19c", label: "Define when to notify lactation team (volume milestones or concerns)", checked: false, description: "" },
        { id: "19d", label: "Review red flags: Nipple soreness or skin damage; Persistent lumps, tenderness, or hardness", checked: false, description: "" },
        { id: "19e", label: "Show how to create alerts in the app", checked: false, description: "" },
        { id: "19f", label: "Add additional personal recommendations", checked: false, description: "" },
      ],
    },
    {
      id: "20",
      label: "Transition to Maintenance Pumping (If Appropriate)",
      checked: false,
      description: "Transition to Maintenance Pumping (If Appropriate)",
      hideCheckbox: true,
      subItems: [
        { id: "20a", label: "Explain switch from initiation to maintenance pattern", checked: false, description: "" },
        { id: "20b", label: "Transition when milk volume ≥ 20 mL combined (typically day 2–6)", checked: false, description: "" },
      ],
    },
  ],
  "12-18": [
    {
      id: "s12-1",
      label: "Follow-Up & PP2 Preparation",
      checked: false,
      description: "Follow-Up & PP2 Preparation Checklist",
      hideCheckbox: true,
      subItems: [
        { id: "s12-1a", label: "Check mother is logging minimum 5 pumping sessions/day", checked: false, description: "" },
        { id: "s12-1b", label: "If milk volume ≥ 20 mL combined, instruct change of pumping program", checked: false, description: "" },
        { id: "s12-1c", label: "Review mother's app activity and video progress", checked: false, description: "" },
        { id: "s12-1d", label: "Check if reminders or clarifications are needed", checked: false, description: "" },
        { id: "s12-1e", label: "Review PP2 checklist before consultation", checked: false, description: "" },
      ],
    },
  ],
  "18-24": [
    {
      id: "s18-1",
      label: "test data",
      checked: false,
      description: "Test data",
      hideCheckbox: true,
      subItems: [
        { id: "s18-1a", label: "Test item 1", checked: false, description: "" },
        { id: "s18-1b", label: "Test item 2", checked: false, description: "" },
        { id: "s18-1c", label: "Test item 3", checked: false, description: "" },
        { id: "s18-1d", label: "Test item 4", checked: false, description: "" },
        { id: "s18-1e", label: "Test item 5", checked: false, description: "" },
      ],
    },
  ],
}

function LogSheet({
  patientId,
  notes,
  completionLog,
  noteContext,
  onAddNote,
  isOpen,
  onClose,
}: {
  patientId: string
  notes: Note[]
  completionLog: CompletionEntry[]
  noteContext: { id: string; label: string } | null
  onAddNote: (text: string, source: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  const [newNote, setNewNote] = React.useState("")

  const handleSendNote = () => {
    if (newNote.trim()) {
      const source = noteContext?.label ?? "General notes"
      onAddNote(newNote.trim(), source)
      setNewNote("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendNote()
    }
  }

  const entries: LogEntry[] = React.useMemo(() => {
    const completed: LogEntry[] = completionLog.map((e) => ({
      type: "completed" as const,
      id: e.id,
      by: e.by,
      itemLabel: e.itemLabel,
      timestamp: e.timestamp,
    }))
    const fromNotes: LogEntry[] = notes.map((n) => ({
      type: "note" as const,
      id: n.id,
      text: n.text,
      source: n.source,
      timestamp: n.timestamp,
    }))
    return [...completed, ...fromNotes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [notes, completionLog])

  const formatDateTime = (d: Date) => ({
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  })

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Log</SheetTitle>
          <SheetDescription className="mt-2">Add notes to the chain. Completions and notes appear here.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No activity yet. Start a conversation...
              </div>
            ) : (
              entries.map((entry) => {
                if (entry.type === "completed") {
                  const { date, time } = formatDateTime(entry.timestamp)
                  return (
                    <div key={entry.id} className="flex flex-col gap-1.5">
                      <div className="bg-muted/50 rounded-lg p-4 max-w-[85%] shadow-sm border border-border/50">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-medium">{entry.by}</span> completed: {entry.itemLabel}
                        </p>
                        <div className="flex flex-col gap-1 pt-2 border-t border-border/50 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {date} at {time}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={entry.id} className="flex flex-col gap-1.5">
                    <div className="bg-muted rounded-lg p-4 max-w-[85%] ml-auto shadow-sm">
                      <p className="text-sm text-foreground leading-relaxed mb-2">{entry.text}</p>
                      <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
                        <span className="text-xs font-medium text-muted-foreground">From: {entry.source}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp).date} at {formatDateTime(entry.timestamp).time}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="border-t px-6 py-4 bg-background">
            <div className="mb-2">
              <span className="text-xs text-muted-foreground">
                {noteContext ? (
                  <>
                    Adding note from: <span className="font-medium">{noteContext.label}</span>
                  </>
                ) : (
                  <span className="font-medium">General notes</span>
                )}
              </span>
            </div>
            <div className="flex gap-3">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your note..."
                className="flex-1"
              />
              <Button onClick={handleSendNote} disabled={!newNote.trim()} size="default">
                Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ChecklistItem({
  item,
  onOpenNotes,
  onMarkCompleted,
  isSubItem = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onOpenInModal,
}: {
  item: TimelineItem | { id: string; label: string; checked: boolean; description: string }
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  isSubItem?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
  onOpenInModal?: (item: TimelineItem) => void
}) {
  const [internalExpanded, setInternalExpanded] = React.useState(false)
  const isControlled = controlledExpanded !== undefined && onToggleExpand !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded
  const useModal = onOpenInModal && !isSubItem

  const [isChecked, setIsChecked] = React.useState(item.checked)
  const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0
  const subItems = hasSubItems ? item.subItems! : []
  const showCheckbox = !("hideCheckbox" in item && item.hideCheckbox)

  const handleMarkCompleted = () => {
    setIsChecked(true)
    onMarkCompleted?.(item.id, item.label)
  }

  const handleRowClick = () => {
    if (useModal && onOpenInModal) {
      onOpenInModal(item as TimelineItem)
    } else if (!useModal) {
      if (isControlled) {
        onToggleExpand?.()
      } else {
        setInternalExpanded((p) => !p)
      }
    }
  }

  return (
    <div className={cn("bg-background border border-border/50 rounded-md overflow-hidden shadow-sm", isSubItem && "ml-6 border-l-2 border-l-primary/30")}>
      <div className={cn("flex gap-3 p-3", isSubItem ? "items-center" : "items-start")}>
        {showCheckbox ? (
          <Checkbox
            id={item.id}
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            className={cn("shrink-0", isSubItem ? "mt-0" : "mt-0.5")}
          />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={useModal ? () => onOpenInModal?.(item as TimelineItem) : handleRowClick}
          onKeyDown={useModal ? undefined : (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), handleRowClick())}
          role="button"
          tabIndex={0}
          aria-expanded={useModal ? undefined : isExpanded}
          aria-label={useModal ? "Open details" : (isExpanded ? "Collapse details" : "Expand details")}
        >
          <div className={cn("flex justify-between gap-2 flex-1 min-w-0", isSubItem ? "items-center" : "items-start")}>
            <Label htmlFor={showCheckbox ? item.id : undefined} className={cn("font-normal leading-relaxed flex-1 py-0.5", isSubItem ? "text-xs" : "text-sm", showCheckbox && "cursor-pointer")}>
              {item.label}
            </Label>
            {!isSubItem && (useModal ? (
              <ChevronRight className="size-4 text-muted-foreground shrink-0" aria-hidden />
            ) : (
              <span className="shrink-0 p-1 rounded transition-colors pointer-events-none" aria-hidden>
                {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
              </span>
            ))}
          </div>
          {!useModal && isExpanded && (
            <div className="mt-2 space-y-2">
              {item.description ? (
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded border border-border/30">{item.description}</p>
              ) : null}
              {hasSubItems && (
                <div className="space-y-2 mt-2">
                  {subItems.map((sub) => (
                    <ChecklistItem key={sub.id} item={sub} onOpenNotes={onOpenNotes} onMarkCompleted={onMarkCompleted} isSubItem />
                  ))}
                </div>
              )}
              {!isSubItem && (
                <div className="flex flex-wrap gap-2 justify-start">
                  <Button variant="default" size="sm" className="text-xs shrink-0" onClick={handleMarkCompleted}>
                    Complete
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => {}}>
                    Skip
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => onOpenNotes({ id: item.id, label: item.label }, false)}>
                    Add note
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailModal({
  title,
  onClose,
  children,
  dialogClassName,
  sessionCount,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  dialogClassName?: string
  /** When set, shows a badge next to the title e.g. "9 sessions" (can vary per person). */
  sessionCount?: number
}) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 cursor-pointer"
          onClick={onClose}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-0 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            dialogClassName
          )}
          onEscapeKeyDown={onClose}
          onInteractOutside={onClose}
        >
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2 min-w-0">
                <Dialog.Title className="text-lg font-semibold text-foreground truncate">
                  {title}
                </Dialog.Title>
                {sessionCount != null && (
                  <Badge variant="secondary" className="shrink-0">
                    {sessionCount} session{sessionCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Dialog.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none -mr-2">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              {children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SubsectionModal({
  item,
  onClose,
  onOpenNotes,
  onMarkCompleted,
  onSkip,
  isNotesOpen = false,
}: {
  item: TimelineItem
  onClose: () => void
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  onSkip?: (itemId: string) => void
  isNotesOpen?: boolean
}) {
  const hasSubItems = item.subItems && item.subItems.length > 0
  const handleMarkCompleted = () => {
    onMarkCompleted?.(item.id, item.label)
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !isNotesOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 cursor-pointer"
          onClick={() => !isNotesOpen && onClose()}
        />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-0 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onEscapeKeyDown={() => onClose()}
          onInteractOutside={(e) => {
            if (isNotesOpen) e.preventDefault()
            else onClose()
          }}
        >
            <div className="flex flex-col max-h-[85vh]">
            <div className="flex flex-col gap-2 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-foreground pr-8">
                  {item.label}
                </Dialog.Title>
                <Dialog.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none -mr-2">
                  <X className="size-5" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>
            </div>
            <div className="overflow-y-auto px-6 py-4 space-y-4">
              {item.description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              ) : null}
              {hasSubItems && (
                <div className="space-y-2">
                  <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                    {item.subItems!.map((sub) => (
                      <ChecklistItem key={sub.id} item={sub} onOpenNotes={onOpenNotes} onMarkCompleted={onMarkCompleted} isSubItem />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-start items-center pt-4 mt-4 border-t border-border/50">
                <Button variant="default" size="sm" className="text-xs shrink-0" onClick={handleMarkCompleted}>
                  Complete
                </Button>
                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => { onSkip?.(item.id); onClose(); }}>
                  Skip
                </Button>
                <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={() => onOpenNotes({ id: item.id, label: item.label }, false)}>
                  Add note
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function TimelineBlock({
  timeRange,
  items,
  onOpenNotes,
  onMarkCompleted,
  onSkip,
  isNotesOpen = false,
  completedIds = new Set(),
  skippedIds = new Set(),
  defaultOpen = false,
  isCurrentSection = false,
}: {
  timeRange: string
  items: TimelineItem[]
  onOpenNotes: (item: { id: string; label: string }, isGeneral?: boolean) => void
  onMarkCompleted?: (itemId: string, itemLabel: string) => void
  onSkip?: (itemId: string) => void
  isNotesOpen?: boolean
  completedIds?: Set<string>
  skippedIds?: Set<string>
  /** When true (e.g. from notification link), this section opens on mount. */
  defaultOpen?: boolean
  /** This block is the current time window (0–6h, 6–12h, etc.); others are greyed out. */
  isCurrentSection?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [modalItem, setModalItem] = React.useState<TimelineItem | null>(null)

  const doneCount = items.filter((i) => completedIds.has(i.id) || skippedIds.has(i.id)).length
  const totalCount = items.length
  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  return (
    <div className={cn("flex flex-col w-full transition-opacity", !isCurrentSection && "opacity-70 hover:opacity-100 group/block")}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-between px-6 py-4 bg-background border rounded-xl transition-all w-full text-left group overflow-hidden",
          isCurrentSection
            ? "hover:border-primary/50 hover:shadow-sm"
            : "border-border/80 hover:border-muted-foreground/50",
          isOpen && "border-primary/50 shadow-sm bg-accent/30",
          !isCurrentSection && isOpen && "opacity-100"
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity", isOpen && isCurrentSection && "opacity-100")} />
        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-sm font-semibold", isCurrentSection ? "text-foreground" : "text-muted-foreground")}>{timeRange} hours</span>
              {isCurrentSection && (
                <span className="text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/15 px-1.5 py-0.5 rounded">Current</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{isOpen ? "Click to collapse" : "Click to expand"}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums w-8">{doneCount}/{totalCount}</span>
          </div>
        </div>
        <div className={cn("relative transition-transform duration-200 shrink-0", isOpen && "rotate-180")}>
          <ChevronDown className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </button>
      {isOpen && (
        <div className="mt-3 mx-2 mb-2 bg-muted/30 rounded-lg border border-border/50 p-4">
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} id={`timeline-item-${item.id}`}>
                <ChecklistItem
                  item={item}
                  onOpenNotes={onOpenNotes}
                  onMarkCompleted={onMarkCompleted}
                  onOpenInModal={(i) => setModalItem(i)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {modalItem && (
        <SubsectionModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onOpenNotes={onOpenNotes}
          onMarkCompleted={onMarkCompleted}
          onSkip={onSkip}
          isNotesOpen={isNotesOpen}
        />
      )}
    </div>
  )
}

export default function CaseFileDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionFromUrl = searchParams.get("section") ?? null
  const itemFromUrl = searchParams.get("item") ?? null
  const [patientNotes, setPatientNotes] = React.useState<Note[]>([])
  const [completionLog, setCompletionLog] = React.useState<CompletionEntry[]>([])
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(() => new Set())
  const [skippedIds, setSkippedIds] = React.useState<Set<string>>(() => new Set())
  const [isLogOpen, setIsLogOpen] = React.useState(false)
  const [noteContext, setNoteContext] = React.useState<{ id: string; label: string } | null>(null)
  const [detailModal, setDetailModal] = React.useState<"mother" | "baby" | null>(null)

  const patientId = pathname.split("/").pop() ?? ""
  const mockPatient = getPatientData(patientId)
  const [now, setNow] = React.useState(() => new Date())

  // Update "now" every minute so time-since-birth and current section stay in sync
  // Update every second so "Xh Ym since birth" and current section stay live
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // When opened from a notification link with ?section=...&item=..., scroll to the checklist item
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
        <Button variant="ghost" size="sm" onClick={() => router.push("/case-files")} className="mb-4">
          ← Back to Case Files
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
  // Demo: cycle time-since-birth so it always stays under 24h (0–24 repeats when over). Each baby has a different
  // birth time in data, so they land at different points in the cycle. Remove this and use realHoursSinceBirth
  // for production so that after 24h the timeline shows "24h+" and no section is in focus.
  const hoursSinceBirth =
    realHoursSinceBirth >= 24 ? realHoursSinceBirth % 24 : realHoursSinceBirth
  const currentSectionKey = getCurrentSectionKey(hoursSinceBirth)
  // Same time for baby card so it matches Care Timeline (chronological = corrected when < 24h)
  const ageDisplayForCard = (() => {
    const h = Math.floor(hoursSinceBirth)
    const m = Math.round((hoursSinceBirth - h) * 60)
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  })()

  return (
    <div className="px-4 lg:px-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/case-files")} className="mb-4">
        ← Back to Case Files
      </Button>

      <Card className="mb-6">
        <CardContent className="py-5 px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-0">
            {/* Left: Mother / Patient */}
            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:border-r lg:pr-6 lg:border-border">
              <div className="flex items-start gap-4">
                <div className="min-w-0 space-y-1">
                  <button
                    type="button"
                    onClick={() => setDetailModal("mother")}
                    className="inline-flex items-center gap-1.5 text-left cursor-pointer hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                  >
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {mockPatient.motherName}
                    </h2>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {mockPatient.motherAgeYears} years old · Baby: {mockPatient.motherLastName}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="font-mono text-xs font-normal">
                      {mockPatient.id}
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

            {/* Middle: Mom & baby location */}
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

            {/* Right: Baby details */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 lg:pl-6">
              <button
                type="button"
                onClick={() => setDetailModal("baby")}
                className="inline-flex items-center gap-2 text-left cursor-pointer hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm w-fit"
              >
                <Users2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                <h3 className="font-semibold">{mockPatient.motherLastName}, {mockPatient.babyGender}</h3>
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
          </div>
        </CardContent>
      </Card>

      {detailModal === "mother" && (
        <DetailModal title={mockPatient.motherName} onClose={() => setDetailModal(null)} dialogClassName="max-w-2xl" sessionCount={hourlyMilkVolumeData.length}>
          <div className="space-y-4">
            <Tabs defaultValue="hourly" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="hourly">
                  Hourly milk volume trend
                </TabsTrigger>
                <TabsTrigger value="leftRight">
                  Left vs Right
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hourly" className="mt-4">
                <p className="text-sm font-medium mb-2">Hourly milk volume (ml)</p>
                <ChartContainer config={hourlyChartConfig} className="aspect-auto h-[220px] w-full">
                  <BarChart
                    accessibilityLayer
                    data={hourlyMilkVolumeData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, 100]}
                      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                      tickFormatter={(v) => `${v} ml`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          labelFormatter={(_, payload) => {
                            const session = payload?.[0]?.payload?.session
                            return session != null ? `Session ${session}` : ""
                          }}
                        />
                      }
                    />
                    <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                      {hourlyMilkVolumeData.map((entry, index) => (
                        <Cell key={`${entry.hour}-${index}`} fill={getVolumeBarColor(entry.volume)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="leftRight" className="mt-4">
                <p className="text-sm font-medium mb-2">Left vs Right breast output (ml)</p>
                <ChartContainer config={leftRightChartConfig} className="h-[220px] w-full">
                  <BarChart data={leftVsRightData} margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="left" fill="var(--color-left)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="right" fill="var(--color-right)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </div>
        </DetailModal>
      )}
      {detailModal === "baby" && (() => {
        const babyWeightKg = parseWeightKg(mockPatient.currentWeight)
        const pmaWeeks = postmenstrualAgeWeeks(mockPatient.gestationalAgeWeeks, mockPatient.age)
        const babyLabel = `${mockPatient.motherLastName}, ${mockPatient.babyGender}`
        const genderLabel = mockPatient.babyGender === "Baby Girl" ? "Female" : mockPatient.babyGender === "Baby Boy" ? "Male" : "Unknown"
        return (
          <DetailModal title={babyLabel} onClose={() => setDetailModal(null)} dialogClassName="max-w-2xl">
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-foreground">Fenton Growth Chart - Weight for Age</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                    {genderLabel} • GA: {mockPatient.gestationalAgeWeeks}w
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
                    Z-Score: -3.00
                  </Badge>
                </div>
              </div>
              <ChartContainer
                config={fentonChartConfig}
                className="aspect-auto h-[300px] w-full min-w-0 overflow-visible [&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:text-xs"
              >
                <LineChart
                  accessibilityLayer
                  data={fentonWeightData}
                  margin={{ left: 52, right: 24, top: 20, bottom: 44 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="week"
                    type="number"
                    domain={[30, 40]}
                    tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
                    axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                    tickMargin={10}
                    tickFormatter={(v) => `${v}`}
                    label={{ value: "Postmenstrual Age (weeks)", position: "bottom", offset: 24 }}
                  />
                  <YAxis
                    tickLine={{ stroke: "#64748b", strokeWidth: 1 }}
                    axisLine={{ stroke: "#475569", strokeWidth: 2 }}
                    tickMargin={10}
                    domain={[0.4, 4.5]}
                    tickFormatter={(v) => `${v}`}
                    label={{ value: "Weight (kg)", angle: -90, position: "insideLeft", offset: 10 }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line dataKey="p3" type="monotone" stroke="var(--color-p3)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <Line dataKey="p10" type="monotone" stroke="var(--color-p10)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <Line dataKey="p50" type="monotone" stroke="var(--color-p50)" strokeWidth={2} dot={false} />
                  <Line dataKey="p90" type="monotone" stroke="var(--color-p90)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <Line dataKey="p97" type="monotone" stroke="var(--color-p97)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <ReferenceDot
                    x={pmaWeeks}
                    y={babyWeightKg}
                    r={6}
                    fill="var(--color-baby)"
                    stroke="var(--color-baby)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(350,70%,60%)]" /> 3rd %ile
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(25,90%,55%)]" /> 10th %ile
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-[hsl(220,80%,50%)]" /> 50th %ile (Median)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(25,90%,55%)]" /> 90th %ile
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-b-2 border-dashed border-[hsl(350,70%,60%)]" /> 97th %ile
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(270,60%,55%)]" /> {babyLabel}
                </span>
              </div>
            </div>
          </DetailModal>
        )
      })()}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
            <CardTitle className="shrink-0">Care Timeline</CardTitle>
            <span className="text-sm text-muted-foreground font-normal tabular-nums">
              {formatAgeLive(mockPatient.dateOfBirth, mockPatient.birthTime, now)}
            </span>
            <CardAction className="ml-auto shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleOpenLog(null)}>
                Log
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <TimelineBlock timeRange="0-6" items={timelineChecklists["0-6"]} defaultOpen={false} isCurrentSection={currentSectionKey === "0-6"} onOpenNotes={(item, isGeneral) => handleOpenLog(isGeneral ? null : item)} onMarkCompleted={handleMarkCompleted} onSkip={handleSkip} isNotesOpen={isLogOpen} completedIds={completedIds} skippedIds={skippedIds} />
            <TimelineBlock timeRange="6-12" items={timelineChecklists["6-12"]} defaultOpen={false} isCurrentSection={currentSectionKey === "6-12"} onOpenNotes={(item, isGeneral) => handleOpenLog(isGeneral ? null : item)} onMarkCompleted={handleMarkCompleted} onSkip={handleSkip} isNotesOpen={isLogOpen} completedIds={completedIds} skippedIds={skippedIds} />
            <TimelineBlock timeRange="12-18" items={timelineChecklists["12-18"]} defaultOpen={false} isCurrentSection={currentSectionKey === "12-18"} onOpenNotes={(item, isGeneral) => handleOpenLog(isGeneral ? null : item)} onMarkCompleted={handleMarkCompleted} onSkip={handleSkip} isNotesOpen={isLogOpen} completedIds={completedIds} skippedIds={skippedIds} />
            <TimelineBlock timeRange="18-24" items={timelineChecklists["18-24"]} defaultOpen={false} isCurrentSection={currentSectionKey === "18-24"} onOpenNotes={(item, isGeneral) => handleOpenLog(isGeneral ? null : item)} onMarkCompleted={handleMarkCompleted} onSkip={handleSkip} isNotesOpen={isLogOpen} completedIds={completedIds} skippedIds={skippedIds} />
          </div>
          <LogSheet
            patientId={mockPatient.id}
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
