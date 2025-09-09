import { DatabaseProject, CreateProjectData, UpdateProjectData } from '@/types/database'

export interface IProjectService {
  getProjectById(id: string): Promise<DatabaseProject | null>
  getProjectBySlug(category: string, slug: string): Promise<DatabaseProject | null>
  getProjectsByCategory(category: string): Promise<DatabaseProject[]>
  getAllProjects(): Promise<DatabaseProject[]>
  createProject(data: CreateProjectData): Promise<DatabaseProject>
  updateProject(data: UpdateProjectData): Promise<DatabaseProject>
  deleteProject(id: string): Promise<void>
  generateSlug(title: string): string
  validateProjectData(data: Partial<CreateProjectData>): { isValid: boolean; errors: string[] }
}
