import { readFileSync } from 'fs'
import { join } from 'path'
import { Project } from '@/types/project'
import { getProjectsFromBlob } from '@/lib/blob-storage'

// Legacy project data interface for existing JSON files
interface LegacyProjectData {
  id: string
  title: string
  architect: string
  location: string
  year: string
  system: string
  type: string
  area: string
  coverImage: {
    src: string
    alt: string
  }
  images: Array<{
    src: string
    alt: string
  }>
  description: string
  challenge: string
  solution: string
  result: string
  specs: {
    system: string
    foundations: string
    structure: string
    normative: string
  }
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  try {
    // Try to get from Vercel Blob first (production)
    const projects = await getProjectsFromBlob(category)
    if (projects.length > 0) {
      return projects
    }
    
    // Fallback to local JSON files (development)
    const filePath = join(process.cwd(), 'src', 'data', `${category}.json`)
    const fileContents = readFileSync(filePath, 'utf8')
    const legacyProjects: LegacyProjectData[] = JSON.parse(fileContents)
    
    // Convert legacy format to current Project type
    return legacyProjects.map(project => ({
      ...project,
      type: project.type as Project['type'] // Type assertion for compatibility
    }))
  } catch (error) {
    console.error(`Error reading projects for category ${category}:`, error)
    return []
  }
}

export async function getProjectBySlug(category: string, slug: string): Promise<Project | null> {
  try {
    const projects = await getProjectsByCategory(category)
    return projects.find(project => project.id === slug) || null
  } catch (error) {
    console.error(`Error finding project ${slug} in category ${category}:`, error)
    return null
  }
}
