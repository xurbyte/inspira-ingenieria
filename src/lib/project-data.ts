import { getProjectService } from './dependency-injection'
import { DatabaseProject } from '@/types/database'

export async function getProjectsByCategory(category: string): Promise<DatabaseProject[]> {
  try {
    const projectService = getProjectService()
    return await projectService.getProjectsByCategory(category)
  } catch (error) {
    console.error(`Error reading projects for category ${category}:`, error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<DatabaseProject | null> {
  try {
    const projectService = getProjectService()
    return await projectService.getProjectBySlug(slug)
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}
