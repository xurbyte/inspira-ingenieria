import { DatabaseProject, CreateProjectData, UpdateProjectData } from '@/types/database'

export interface IProjectService {
  getProjectById(id: string): Promise<DatabaseProject | null>
  getProjectBySlug(slug: string): Promise<DatabaseProject | null> // Updated to single argument
  getProjectsByCategory(category: string): Promise<DatabaseProject[]>
  getAllProjects(): Promise<DatabaseProject[]>
  createProject(data: CreateProjectData): Promise<DatabaseProject>
  updateProject(data: UpdateProjectData): Promise<DatabaseProject>
  deleteProject(id: string): Promise<void>
  generateSlug(title: string, excludeId?: string): Promise<string> // Updated to async for uniqueness check
}