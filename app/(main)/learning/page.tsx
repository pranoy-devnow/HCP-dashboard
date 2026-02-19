"use client"

import * as React from "react"
import { ChevronDown, FileText, Video, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ModuleLink = { label: string; href?: string; type: "pdf" | "video" | "sheet" }

type Module = {
  title: string
  links?: ModuleLink[]
}

type Course = {
  id: string
  number: number
  title: string
  goal: string
  modules: Module[]
  outcome: string
}

const courses: Course[] = [
  {
    id: "1",
    number: 1,
    title: "Foundations of NICU Pumping Care",
    goal: "Understand why early pumping matters and how to introduce the pathway safely.",
    modules: [
      { title: "Role of milk for NICU infants", links: [{ label: "Providing Milk for Your NICU Baby. Getting Started", href: "#", type: "pdf" }] },
      { title: "Why pump type matters in NICU", links: [{ label: "Does the Type of Breast Pump Matter for a NICU Mom?", href: "#", type: "pdf" }] },
      { title: "First 14 days and mammary gland programming", links: [{ label: "Coming to Volume", href: "#", type: "pdf" }] },
      { title: "Normal milk volume expectations", links: [{ label: "What is a Normal Amount of Milk to Pump?", href: "#", type: "pdf" }] },
    ],
    outcome: "Nurse understands physiology + sets realistic expectations.",
  },
  {
    id: "2",
    number: 2,
    title: "First Pumping Session (Golden 6 Hours)",
    goal: "Safely guide the mother through her first pumping experience.",
    modules: [
      { title: "First pump assisted checklist" },
      { title: "Helping mother pump within 6 hours" },
      { title: "Sensations during pumping", links: [{ label: "What Will I Feel When I Use the Breast Pump?", href: "#", type: "pdf" }] },
      { title: "Emotional support & information overload avoidance" },
      { title: "Logging first pumping data" },
    ],
    outcome: "Nurse confidently supports first pumping without overwhelming mother.",
  },
  {
    id: "3",
    number: 3,
    title: "Pump Setup & Technical Training",
    goal: "Make nurses experts in pump operation and teaching.",
    modules: [
      { title: "Symphony pump overview", links: [{ label: "Symphony overview sheet", href: "#", type: "sheet" }] },
      { title: "Pump assembly", links: [{ label: "Assemble pump", href: "https://www.youtube.com/watch?v=4mdW147w7AM", type: "video" }] },
      { title: "Initiation program", links: [{ label: "Start initiate program", href: "https://www.youtube.com/watch?v=3Nhqj_YXjs4", type: "video" }] },
      { title: "Which program to use when", links: [{ label: "Program selection", href: "https://www.youtube.com/watch?v=rI5Y7TqQFTo", type: "video" }] },
    ],
    outcome: "Nurse can train mothers independently.",
  },
  {
    id: "4",
    number: 4,
    title: "Breast & Nipple Assessment",
    goal: "Clinical assessment before pumping begins.",
    modules: [
      { title: "Evaluating nipple base", links: [{ label: "Education sheet", href: "#", type: "sheet" }] },
      { title: "Evaluating nipple circumference", links: [{ label: "Education sheet", href: "#", type: "sheet" }] },
      { title: "Evaluating nipple elasticity", links: [{ label: "Education sheet", href: "#", type: "sheet" }] },
      { title: "Identifying early complications" },
      { title: "Reporting issues via NICU app" },
    ],
    outcome: "Early prevention of injury and lactation failure.",
  },
  {
    id: "5",
    number: 5,
    title: "Breast Shield Personalization",
    goal: "Proper fitting to prevent pain and increase milk output.",
    modules: [
      { title: "Choosing breast shield size", links: [{ label: "Considerations when Choosing a Breast Shield", href: "#", type: "pdf" }] },
      { title: "Correct fit principles", links: [{ label: "Getting the Right Fit: Breast Shields", href: "#", type: "pdf" }] },
      { title: "When shield is too large", links: [{ label: "Assessment & Adjustment", href: "#", type: "pdf" }] },
      { title: "Areolar movement rules (≤ 1/8 inch)" },
      { title: "Size changes during first 14 days" },
    ],
    outcome: "Nurse personalizes pumping setup safely.",
  },
  {
    id: "6",
    number: 6,
    title: "Assisted Pumping Optimization",
    goal: "Improve efficiency and comfort during sessions.",
    modules: [
      { title: "Double pumping benefits" },
      { title: "What to watch during pumping", links: [{ label: "Watch While Pumping (PDF)", href: "https://strapi-lactahub.org/uploads/17_watchwhilepumping_final_july_6_3f3fb32f1c.pdf", type: "pdf" }] },
      { title: "Nipple centering", links: [{ label: "Centering nipple video", href: "#", type: "video" }] },
      { title: "Off-center correction", links: [{ label: "Adjustment video", href: "#", type: "video" }] },
      { title: "Optimal breast shield pressure", links: [{ label: "Pressure video", href: "#", type: "video" }] },
    ],
    outcome: "Nurses can troubleshoot live pumping problems.",
  },
  {
    id: "7",
    number: 7,
    title: "Vacuum Pressure & Milk Removal Optimization",
    goal: "Teach personalization for comfort + milk production.",
    modules: [
      { title: "Finding maximum comfortable vacuum", links: [{ label: "Optimizing Milk Removal", href: "https://lactahub.org/category-4-pumping-nicu-infant/#ref13", type: "video" }] },
      { title: "Signs of too much pressure" },
      { title: "Signs of insufficient pressure" },
      { title: "Daily reassessment teaching" },
    ],
    outcome: "Higher milk output with reduced injury risk.",
  },
  {
    id: "8",
    number: 8,
    title: "Building the Personalized Pumping Plan",
    goal: "Transition from session support to long-term success.",
    modules: [
      { title: "Pump frequency targets (5–8/day)" },
      { title: "Volume milestones (≥20 mL)" },
      { title: "Transition initiation → maintenance" },
      { title: "Red flag monitoring" },
      { title: "Normal physiological responses" },
    ],
    outcome: "Mother leaves with a structured, achievable plan.",
  },
  {
    id: "9",
    number: 9,
    title: "Digital Support & NICU App Workflow",
    goal: "Integrate clinical care with digital monitoring.",
    modules: [
      { title: "Activating NICU Mom App" },
      { title: "Logging pumping sessions" },
      { title: "Reporting symptoms" },
      { title: "Creating alerts" },
      { title: "Preparing for PP1 consultation" },
    ],
    outcome: "Nurses use digital tools consistently.",
  },
  {
    id: "10",
    number: 10,
    title: "Follow-Up & Consultation Preparation",
    goal: "Structured ongoing care.",
    modules: [
      { title: "Preparing for first consultation" },
      { title: "Reviewing pumping data trends" },
      { title: "Milk volume progression coaching" },
      { title: "Preparing PP2 consultation" },
    ],
    outcome: "Standardized follow-up across NICU staff.",
  },
]

function ModuleLinkIcon({ type }: { type: ModuleLink["type"] }) {
  if (type === "video") return <Video className="size-3.5 shrink-0" />
  if (type === "sheet") return <FileText className="size-3.5 shrink-0" />
  return <FileText className="size-3.5 shrink-0" />
}

function CourseCard({
  course,
  isExpanded,
  onToggle,
  isCompleted,
  onToggleComplete,
}: {
  course: Course
  isExpanded: boolean
  onToggle: () => void
  isCompleted: boolean
  onToggleComplete: (e: React.MouseEvent) => void
}) {
  return (
    <Card className={cn("overflow-hidden transition-all", isExpanded && "ring-2 ring-primary/20 border-primary/30")}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="secondary" className="font-medium">
            Course {course.number}
          </Badge>
          <Button
            variant={isCompleted ? "default" : "outline"}
            size="xs"
            onClick={onToggleComplete}
            className="shrink-0"
          >
            {isCompleted ? "Completed" : "Mark complete"}
          </Button>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left hover:bg-muted/30 -mx-2 px-2 py-1 rounded-md transition-colors mt-1"
        >
          <CardTitle className="text-lg mt-2">{course.title}</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">{course.goal}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {course.modules.length} modules
            </span>
            <ChevronDown
              className={cn("size-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
            />
          </div>
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 border-t border-border/50 bg-muted/20">
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Modules</h4>
              <ul className="space-y-3">
                {course.modules.map((mod, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      {i + 1}. {mod.title}
                    </span>
                    {mod.links?.length ? (
                      <div className="flex flex-wrap gap-2 pl-4">
                        {mod.links.map((link, j) => (
                          <a
                            key={j}
                            href={link.href}
                            target={link.href?.startsWith("http") ? "_blank" : undefined}
                            rel={link.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                          >
                            <ModuleLinkIcon type={link.type} />
                            {link.label}
                            {(link.href?.startsWith("http") ?? false) && <ExternalLink className="size-3" />}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-background border p-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Outcome</h4>
              <p className="text-sm">{course.outcome}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function LearningPage() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [completedCourses, setCompletedCourses] = React.useState<Set<string>>(new Set())

  const totalCourses = courses.length
  const completedCount = completedCourses.size
  const progressPct = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0

  return (
    <div className="px-4 lg:px-6">
      {/* Progress section */}
      <Card className="mb-6 py-4">
        <CardContent className="px-4 sm:px-6 pt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 sm:min-h-8">
            <span className="text-sm font-semibold shrink-0 sm:flex sm:items-center sm:h-8">Learning progress</span>
            <div className="flex flex-1 min-w-0 items-center gap-3 sm:h-8">
              <div className="h-2 flex-1 min-w-0 rounded-full bg-muted overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs tabular-nums font-medium shrink-0">
                {completedCount} of {totalCourses} ({Math.round(progressPct)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course grid */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">My courses</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Expand a course to view modules and resources.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isExpanded={expandedId === course.id}
            onToggle={() => setExpandedId((prev) => (prev === course.id ? null : course.id))}
            isCompleted={completedCourses.has(course.id)}
            onToggleComplete={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setCompletedCourses((prev) => {
                const next = new Set(prev)
                if (next.has(course.id)) next.delete(course.id)
                else next.add(course.id)
                return next
              })
            }}
          />
        ))}
      </div>
    </div>
  )
}
