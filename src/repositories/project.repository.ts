import { Category } from '@/types/enums'
import { prisma } from '@/lib/database'
import { DatabaseProject, CreateProjectData, UpdateProjectData, ProjectImage, ProjectSpecs } from '@/types/database'
import { IProjectRepository } from './interfaces/project-repository.interface'
import { Project } from '@prisma/client'
import { Prisma } from '@prisma/client'

export class ProjectRepository implements IProjectRepository {
  
  async findById(id: string): Promise<DatabaseProject | null> {
    const project = await prisma.project.findUnique({
      where: { id }
    })
    
    return project ? this.mapPrismaToDatabase(project) : null
  }

  async findBySlug(category: Category, slug: string): Promise<DatabaseProject | null> {

    const title = this.slugToTitle(slug)
    
    const project = await prisma.project.findFirst({
      where: {
        category,
        title: {
          contains: title,
          mode: 'insensitive'
        }
      }
    })
    
    return project ? this.mapPrismaToDatabase(project) : null
  }

  async findByCategory(category: Category): Promise<DatabaseProject[]> {
    const projects = await prisma.project.findMany({
      where: { category }
    })
    return projects.map((project: Project) => this.mapPrismaToDatabase(project))
  }

  async findAll(): Promise<DatabaseProject[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return projects.map((project: Project) => this.mapPrismaToDatabase(project))
  }

  async create(data: CreateProjectData): Promise<DatabaseProject> {
    const project = await prisma.project.create({
      data: {
        ...data,
        coverImage: data.coverImage as unknown as Prisma.InputJsonValue,
        images: data.images as unknown as Prisma.InputJsonValue[],
        specs: data.specs as unknown as Prisma.InputJsonValue
      }
    })
    
    return this.mapPrismaToDatabase(project)
  }

  async update(data: UpdateProjectData): Promise<DatabaseProject> {
    const { id, ...updateData } = data
    
    const updatePayload: Record<string, unknown> = { ...updateData }
    
    if (updateData.coverImage) {
      updatePayload.coverImage = updateData.coverImage as unknown as Prisma.InputJsonValue
    }
    if (updateData.images) {
      updatePayload.images = updateData.images as unknown as Prisma.InputJsonValue[]
    }
    if (updateData.specs) {
      updatePayload.specs = updateData.specs as unknown as Prisma.InputJsonValue
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: updatePayload
    })
    
    return this.mapPrismaToDatabase(project)
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id }
    })
  }

  private mapPrismaToDatabase(project: Project): DatabaseProject {
    return {
      id: project.id,
      title: project.title,
      slug: this.titleToSlug(project.title),
      architect: project.architect,
      location: project.location,
      year: project.year,
      system: project.system,
      description: project.description,
      challenge: project.challenge,
      solution: project.solution,
      result: project.result,
      category: project.category as Category,
      type: project.type,
      area: project.area,
      coverImage: project.coverImage as unknown as ProjectImage,
      images: project.images as unknown as ProjectImage[],
      specs: project.specs as unknown as ProjectSpecs,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }
  }

  private titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  private slugToTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}
