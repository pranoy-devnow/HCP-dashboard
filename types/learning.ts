/** Link to a learning resource (PDF, video, sheet). */
export type ModuleLink = { label: string; href?: string; type: "pdf" | "video" | "sheet" }

/** A module within a course (title + optional links). */
export type Module = {
  title: string
  links?: ModuleLink[]
}

/** A learning course with modules and metadata. */
export type Course = {
  id: string
  number: number
  title: string
  goal: string
  modules: Module[]
  outcome: string
  duration: string
}
