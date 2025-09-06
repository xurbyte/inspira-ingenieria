import { put, list } from '@vercel/blob'
import { Project } from '@/types/project'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_TOKEN) {
  console.warn('BLOB_READ_WRITE_TOKEN not found. Blob storage will not work in production.')
}

export async function getProjectsFromBlob(category: string): Promise<Project[]> {
  try {
    if (!BLOB_TOKEN) {
      // Fallback to local JSON in development
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs/promises')
        const path = await import('path')
        const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
        const jsonContent = await fs.readFile(jsonPath, 'utf-8')
        return JSON.parse(jsonContent)
      }
      return []
    }

    const { blobs } = await list({ prefix: `projects/${category}.json` })
    
    if (blobs.length === 0) {
      return []
    }

    const response = await fetch(blobs[0].url)
    const projects = await response.json()
    return projects
  } catch (error) {
    console.error('Error reading projects from blob:', error)
    return []
  }
}

export async function saveProjectsToBlob(category: string, projects: Project[]): Promise<boolean> {
  try {
    if (!BLOB_TOKEN) {
      // Fallback to local JSON in development
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs/promises')
        const path = await import('path')
        const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
        await fs.writeFile(jsonPath, JSON.stringify(projects, null, 2))
        return true
      }
      throw new Error('BLOB_READ_WRITE_TOKEN not configured')
    }

    const blob = await put(`projects/${category}.json`, JSON.stringify(projects, null, 2), {
      access: 'public',
      contentType: 'application/json'
    })

    console.log(`Successfully saved ${projects.length} projects to blob: ${blob.url}`)
    return true
  } catch (error) {
    console.error('Error saving projects to blob:', error)
    return false
  }
}

export async function addProjectToBlob(category: string, newProject: Project): Promise<boolean> {
  try {
    const projects = await getProjectsFromBlob(category)
    
    // Check if project with same ID already exists
    const existingIndex = projects.findIndex(p => p.id === newProject.id)
    if (existingIndex !== -1) {
      throw new Error(`Project with ID ${newProject.id} already exists`)
    }
    
    projects.push(newProject)
    return await saveProjectsToBlob(category, projects)
  } catch (error) {
    console.error('Error adding project to blob:', error)
    return false
  }
}

export async function updateProjectInBlob(category: string, projectId: string, updatedProject: Project): Promise<boolean> {
  try {
    const projects = await getProjectsFromBlob(category)
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return false
    }
    
    projects[projectIndex] = updatedProject
    return await saveProjectsToBlob(category, projects)
  } catch (error) {
    console.error('Error updating project in blob:', error)
    return false
  }
}

export async function deleteProjectFromBlob(category: string, projectId: string): Promise<boolean> {
  try {
    const projects = await getProjectsFromBlob(category)
    const updatedProjects = projects.filter(p => p.id !== projectId)
    
    return await saveProjectsToBlob(category, updatedProjects)
  } catch (error) {
    console.error('Error deleting project from blob:', error)
    return false
  }
}
