"use client"

import * as React from "react"
import { getCaseFileById, getCaseFiles } from "@/services/caseFilesService"
import {
  getAtRiskConditionsCardData,
  getUrgentActionCardData,
  getInfantDataItems,
} from "@/lib/case-file-detail-cards-data"
import { getMomDataItems } from "@/lib/mom-data-cards-data"
import { mapInfantDataToCardItems } from "@/lib/infant-data-icons"
import {
  AtRiskConditionsCard,
  UrgentActionCard,
  MilkVolumeAlertCard,
  MedelaFamilyConnectCard,
  DataCard,
  MomDataCard,
} from "@/components/case-file-detail/cards"
import type {
  AtRiskConditionsCardData,
  UrgentActionCardData,
  MilkVolumeAlertCardData,
  MedelaFamilyConnectCardData,
} from "@/types/case-file-detail-cards"
import { cn } from "@/lib/utils"

/** Demo record that yields urgent + at-risk cards in mock data. */
const DEMO_CASE_ID = "PAT-2024-001235"

const SHOWCASE_AT_RISK: AtRiskConditionsCardData = {
  conditions: ["Planned Caesarean Section", "Preterm Birth"],
}

const SHOWCASE_URGENT: UrgentActionCardData = {
  title: "Conduct PP1 consultation",
  timeRemaining: "8 hours",
  subtitle: "24hrs Initiation Phase ends",
  checklistLabel: "PP1 Consult checklist",
}

const SHOWCASE_MILK_VOLUME: MilkVolumeAlertCardData = {
  title: "Milk Volume",
  message: "Daily milk volume dropped by 15% over past 3 days.",
  actionLabel: "Take action",
}

const SHOWCASE_MEDELA_FAMILY: MedelaFamilyConnectCardData = {
  title: "Connect to Medela Family",
  subtitle: "Sync with the official Medela app.",
  actionLabel: "Connect",
}

type GallerySectionVariant = "alerts" | "infant" | "mom"

const VARIANT_STYLES: Record<GallerySectionVariant, { dot: string; label: string }> = {
  alerts: {
    dot: "bg-red-500 shadow-[0_0_0_3px] shadow-red-500/20",
    label: "text-red-700/90 dark:text-red-400/90",
  },
  infant: {
    dot: "bg-emerald-500 shadow-[0_0_0_3px] shadow-emerald-500/20",
    label: "text-emerald-700/90 dark:text-emerald-400/90",
  },
  mom: {
    dot: "bg-violet-500 shadow-[0_0_0_3px] shadow-violet-500/20",
    label: "text-violet-700/90 dark:text-violet-400/90",
  },
}

/** Hover / focus lift applied to each tile in the gallery (not the section wrapper). */
const galleryItemHover = cn(
  "transition-[transform,box-shadow,ring-color] duration-300 ease-out",
  "motion-safe:hover:-translate-y-0.5 motion-safe:focus-within:-translate-y-0.5",
  "motion-safe:hover:shadow-lg motion-safe:focus-within:shadow-md",
  "hover:shadow-black/5 dark:hover:shadow-black/20 dark:focus-within:shadow-black/15",
  "ring-1 ring-transparent motion-safe:hover:ring-2 motion-safe:focus-within:ring-2"
)

const galleryHoverAlertsUrgent = cn(galleryItemHover, "hover:ring-red-500/30 focus-within:ring-red-500/25")
const galleryHoverAlertsAtRisk = cn(galleryItemHover, "hover:ring-amber-500/30 focus-within:ring-amber-500/25")
const galleryHoverAlertsMilk = cn(galleryItemHover, "hover:ring-orange-500/30 focus-within:ring-orange-500/25")
const galleryHoverAlertsMedelaFamily = cn(
  galleryItemHover,
  "hover:ring-sky-500/30 focus-within:ring-sky-500/25"
)
const galleryHoverInfant = cn(galleryItemHover, "hover:ring-emerald-500/30 focus-within:ring-emerald-500/25")
const galleryHoverMom = cn(galleryItemHover, "hover:ring-violet-500/30 focus-within:ring-violet-500/25")

function GallerySection({
  variant,
  id,
  eyebrow,
  title,
  children,
}: {
  variant: GallerySectionVariant
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  const v = VARIANT_STYLES[variant]

  return (
    <section
      aria-labelledby={id}
      className="relative rounded-2xl border border-border/60 bg-muted/10 p-6 dark:bg-muted/5"
    >
      <header className="mb-6 border-b border-border pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className={cn("mt-0.5 size-2.5 shrink-0 rounded-full", v.dot)} aria-hidden />
          <div className="min-w-0 flex-1 space-y-1.5">
            <p
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                v.label
              )}
            >
              {eyebrow}
            </p>
            <h2 id={id} className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
        </div>
      </header>
      <div className="relative">{children}</div>
    </section>
  )
}

export function CardsGallery() {
  const patient = React.useMemo(() => {
    return getCaseFileById(DEMO_CASE_ID) ?? getCaseFiles()[0] ?? null
  }, [])

  const atRiskData = React.useMemo(() => {
    if (!patient) return SHOWCASE_AT_RISK
    return getAtRiskConditionsCardData(patient) ?? SHOWCASE_AT_RISK
  }, [patient])

  const urgentData = React.useMemo(() => {
    if (!patient) return SHOWCASE_URGENT
    return getUrgentActionCardData(patient) ?? SHOWCASE_URGENT
  }, [patient])

  const infantItems = React.useMemo(() => {
    if (!patient) return []
    return mapInfantDataToCardItems(getInfantDataItems(patient))
  }, [patient])

  const momItems = React.useMemo(() => {
    if (!patient) return []
    return getMomDataItems(patient)
  }, [patient])

  const handleKnowMoreNoop = React.useCallback(() => {
    // Gallery only — real case file opens modals / sheets.
  }, [])

  if (!patient) {
    return (
      <div className="px-4 lg:px-6">
        <p className="text-sm text-muted-foreground">No demo patient data available.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-2 lg:px-6">
      <GallerySection
        variant="alerts"
        id="cards-gallery-alerts-heading"
        eyebrow="Section 01 — Alerts"
        title="Alerts"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <UrgentActionCard
            data={urgentData}
            onChecklistClick={() => {}}
            className={galleryHoverAlertsUrgent}
          />
          <AtRiskConditionsCard data={atRiskData} className={galleryHoverAlertsAtRisk} />
          <MilkVolumeAlertCard
            data={SHOWCASE_MILK_VOLUME}
            onActionClick={() => {}}
            className={galleryHoverAlertsMilk}
          />
          <MedelaFamilyConnectCard
            data={SHOWCASE_MEDELA_FAMILY}
            onActionClick={() => {}}
            className={galleryHoverAlertsMedelaFamily}
          />
        </div>
      </GallerySection>

      <GallerySection
        variant="infant"
        id="cards-gallery-infant-heading"
        eyebrow="Section 02 — Infant data"
        title="Infant data"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {infantItems.map((item, i) => (
            <DataCard key={i} item={item} className={galleryHoverInfant} />
          ))}
        </div>
      </GallerySection>

      <GallerySection
        variant="mom"
        id="cards-gallery-mom-heading"
        eyebrow="Section 03 — Mom data"
        title="Mom data"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {momItems.map((item) => (
            <MomDataCard
              key={item.id}
              item={item}
              className={galleryHoverMom}
              onKnowMore={item.showKnowMore !== false ? handleKnowMoreNoop : undefined}
            />
          ))}
        </div>
      </GallerySection>
    </div>
  )
}
