import { Category } from '@/types/enums'
import { DatabaseProject, CreateProjectData, UpdateProjectData } from '@/types/database'

export interface IProjectRepository {
  findById(id: string): Promise<DatabaseProject | null>
  findBySlug(slug: string): Promise<DatabaseProject | null> // Updated to single argument
  findByCategory(category: Category): Promise<DatabaseProject[]>
  findAll(): Promise<DatabaseProject[]>
  create(data: CreateProjectData): Promise<DatabaseProject>
  update(data: UpdateProjectData): Promise<DatabaseProject>
  delete(id: string): Promise<void>
}