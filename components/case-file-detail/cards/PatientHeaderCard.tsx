"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { PatientHeaderCardData } from "@/types/case-file-detail-cards"

export interface PatientHeaderCardProps {
  data: PatientHeaderCardData
  className?: string
}

/** Modular patient header card: avatar, name, ID, subtitle, and grid of key details. */
export function PatientHeaderCard({ data, className }: PatientHeaderCardProps) {
  return (
    <Card className={cn("mb-6", className)}>
      <CardContent className="py-5 px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-12 shrink-0 rounded-full bg-blue-100 text-blue-700">
              <AvatarFallback className="text-sm font-medium">{data.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight">{data.patientName}</h2>
              <p className="text-muted-foreground font-mono text-sm">{data.patientId}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{data.subtitle}</p>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <GridItem label="Hospital" value={data.hospital} />
            <GridItem label="Infant DOB" value={data.infantDob} />
            <GridItem label="Infant Location" value={data.infantLocation} />
            <GridItem label="Mother Location" value={data.motherLocation} />
            <GridItem label="Last Sync" value={data.lastSync} />
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}

function GridItem({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  )
}
