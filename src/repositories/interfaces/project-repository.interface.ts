import { Category } from '@/types/enums'
import { DatabaseProject, CreateProjectData, UpdateProjectData } from '@/types/database'

export interface IProjectReader {
  findById(id: string): Promise<DatabaseProject | null>
  findBySlug(category: Category, slug: string): Promise<DatabaseProject | null>
  findByCategory(category: Category): Promise<DatabaseProject[]>
  findAll(): Promise<DatabaseProject[]>
}

export interface IProjectWriter {
  create(data: CreateProjectData): Promise<DatabaseProject>
  update(data: UpdateProjectData): Promise<DatabaseProject>
  delete(id: string): Promise<void>
}

export interface IProjectRepository extends IProjectReader, IProjectWriter {}
