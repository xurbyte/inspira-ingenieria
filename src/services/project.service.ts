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

  async getProjectBySlug(slug: string): Promise<DatabaseProject | null> {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid slug')
    }
    
    return await this.projectRepository.findBySlug(slug)
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
    data.slug = await this.generateSlug(data.title); // Updated to match interface, but made async for uniqueness

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
    
    if (data.title) {
      data.slug = await this.generateSlug(data.title, data.id); // Updated for uniqueness
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

  async generateSlug(title: string, excludeId?: string): Promise<string> { // Made async for DB check
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingProject = await this.projectRepository.findBySlug(slug);
      if (!existingProject || (excludeId && existingProject.id === excludeId)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  validateProjectData(data: Partial<CreateProjectData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Required fields validation
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
    
    // Only validate coverImage if it's explicitly provided (not undefined)
    if (data.coverImage !== undefined) {
      if (!data.coverImage || !data.coverImage.src || !data.coverImage.alt) {
        // Allow temporary placeholder
        if (data.coverImage?.alt !== 'Temporary') {
          errors.push('Cover image with src and alt is required if provided')
        }
      }
    }
    
    // Only validate images if it's explicitly provided (not undefined)
    if (data.images !== undefined) {
      if (!Array.isArray(data.images)) {
        errors.push('Images must be an array if provided')
      }
    }
    
    if (data.specs !== undefined && (!data.specs || typeof data.specs !== 'object')) {
      errors.push('Specs object is required if provided')
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