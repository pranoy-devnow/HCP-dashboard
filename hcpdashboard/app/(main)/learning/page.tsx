"use client"

import * as React from "react"
import { ChevronDown, FileText, Video, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Course, ModuleLink } from "@/types/learning"
import { getCourses } from "@/services/learningService"

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
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              Course {course.number}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {course.duration}
            </Badge>
          </div>
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
  const courses = getCourses()
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
