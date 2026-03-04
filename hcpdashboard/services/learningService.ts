/**
 * Learning / courses data. All course reads go through this service.
 * When the backend is ready, replace with GET /api/learning/courses or similar.
 */

import type { Course } from "@/types/learning"
import { courses as libCourses } from "@/lib/learning-data"

/** Return all learning courses. For now uses in-memory data; later: GET /api/learning/courses */
export function getCourses(): Course[] {
  try {
    return libCourses
  } catch (err) {
    console.error("[learningService] getCourses failed:", err)
    return []
  }
}
