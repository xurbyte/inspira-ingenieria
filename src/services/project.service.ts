import { Category } from '@/types/enums'
import { DatabaseProject, CreateProjectData, UpdateProjectData } from '@/types/database'
import { IProjectService } from './interfaces/project-service.interface'
import { IProjectRepository } from '@/repositories/interfaces/project-repository.interface'

export class ProjectService implements IProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async getProjectById(id: string): Promise<DatabaseProject | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid project ID')
    }
    
    return await this.projectRepository.findById(id)
  }

  async getProjectBySlug(category: string, slug: string): Promise<DatabaseProject | null> {
    const categoryEnum = this.mapStringToCategory(category)
    if (!categoryEnum) {
      throw new Error(`Invalid category: ${category}`)
    }
    
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid slug')
    }
    
    return await this.projectRepository.findBySlug(categoryEnum, slug)
  }

  async getProjectsByCategory(category: string): Promise<DatabaseProject[]> {
    const categoryEnum = this.mapStringToCategory(category)
    if (!categoryEnum) {
      throw new Error(`Invalid category: ${category}`)
    }
    
    return await this.projectRepository.findByCategory(categoryEnum)
  }

  async getAllProjects(): Promise<DatabaseProject[]> {
    return await this.projectRepository.findAll()
  }

  async createProject(data: CreateProjectData): Promise<DatabaseProject> {
    const validation = this.validateProjectData(data)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await this.projectRepository.create(data)
  }

  async updateProject(data: UpdateProjectData): Promise<DatabaseProject> {
    if (!data.id) {
      throw new Error('Project ID is required for update')
    }
    
    const validation = this.validateProjectData(data)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }
    
    return await this.projectRepository.update(data)
  }

  async deleteProject(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid project ID')
    }
    
    const project = await this.projectRepository.findById(id)
    if (!project) {
      throw new Error('Project not found')
    }
    
    await this.projectRepository.delete(id)
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  validateProjectData(data: Partial<CreateProjectData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (data.title !== undefined && (!data.title || data.title.trim().length === 0)) {
      errors.push('Title is required')
    }
    
    if (data.architect !== undefined && (!data.architect || data.architect.trim().length === 0)) {
      errors.push('Architect is required')
    }
    
    if (data.location !== undefined && (!data.location || data.location.trim().length === 0)) {
      errors.push('Location is required')
    }
    
    if (data.year !== undefined && (!data.year || data.year.trim().length === 0)) {
      errors.push('Year is required')
    }
    
    if (data.system !== undefined && (!data.system || data.system.trim().length === 0)) {
      errors.push('System is required')
    }
    
    if (data.description !== undefined && (!data.description || data.description.trim().length === 0)) {
      errors.push('Description is required')
    }
    
    if (data.challenge !== undefined && (!data.challenge || data.challenge.trim().length === 0)) {
      errors.push('Challenge is required')
    }
    
    if (data.solution !== undefined && (!data.solution || data.solution.trim().length === 0)) {
      errors.push('Solution is required')
    }
    
    if (data.result !== undefined && (!data.result || data.result.trim().length === 0)) {
      errors.push('Result is required')
    }
    
    if (data.category !== undefined && !Object.values(Category).includes(data.category)) {
      errors.push('Invalid category')
    }
    
    if (data.type !== undefined && (!data.type || data.type.trim().length === 0)) {
      errors.push('Type is required')
    }
    
    if (data.coverImage !== undefined && (!data.coverImage || !data.coverImage.src || !data.coverImage.alt)) {
      errors.push('Cover image with src and alt is required')
    }
    
    if (data.images !== undefined && !Array.isArray(data.images)) {
      errors.push('Images must be an array')
    }
    
    if (data.specs !== undefined && (!data.specs || typeof data.specs !== 'object')) {
      errors.push('Specs object is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private mapStringToCategory(category: string): Category | null {
    switch (category.toLowerCase()) {
      case 'viviendas':
        return Category.VIVIENDAS
      case 'naves-industriales':
        return Category.NAVES_INDUSTRIALES
      case 'funcional':
        return Category.FUNCIONAL
      default:
        return null
    }
  }
}
