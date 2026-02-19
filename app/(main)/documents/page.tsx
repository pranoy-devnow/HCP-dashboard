"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { FileText, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const mockDocuments = [
  { id: "DOC-001", title: "Breastfeeding Basics Guide", topic: "Lactation support", pumpingProtocol: "Standard", education: "New parents", dateAdded: "2024-02-01", size: "2.4 MB" },
  { id: "DOC-002", title: "Pumping Schedule Template", topic: "Pumping protocol", pumpingProtocol: "Hospital", education: "Clinical", dateAdded: "2024-01-28", size: "1.1 MB" },
  { id: "DOC-003", title: "Nutrition During Lactation", topic: "Maternal nutrition", pumpingProtocol: "N/A", education: "New parents", dateAdded: "2024-01-25", size: "3.2 MB" },
  { id: "DOC-004", title: "NICU Pumping Protocol", topic: "Pumping protocol", pumpingProtocol: "NICU", education: "Clinical", dateAdded: "2024-01-20", size: "1.8 MB" },
  { id: "DOC-005", title: "Understanding Milk Supply", topic: "Lactation support", pumpingProtocol: "Standard", education: "New parents", dateAdded: "2024-01-15", size: "2.0 MB" },
  { id: "DOC-006", title: "Staff Education: Hand Expression", topic: "Clinical skills", pumpingProtocol: "Hospital", education: "Staff", dateAdded: "2024-01-10", size: "0.9 MB" },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredDocuments = React.useMemo(() => {
    if (!searchQuery.trim()) return mockDocuments
    const query = searchQuery.toLowerCase()
    return mockDocuments.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.topic.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Documents</h1>
        <div className="relative mb-6 w-full sm:w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-[420px]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No documents found matching your search.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                className={cn(
                  "group relative flex flex-col items-start gap-3 p-4 bg-background border rounded-lg",
                  "hover:border-primary/50 hover:shadow-md transition-all text-left",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    <FileText className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.topic}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{doc.dateAdded}</span>
                  <span>{doc.size}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{doc.pumpingProtocol}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{doc.education}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
