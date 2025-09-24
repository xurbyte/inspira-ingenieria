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

  async findBySlug(slug: string): Promise<DatabaseProject | null> {
    const project = await prisma.project.findUnique({
      where: { slug }
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
    // Provide temporary coverImage if not provided
    const createData = {
      ...data,
      slug: data.slug!,
      coverImage: data.coverImage || { src: '', alt: 'Temporary' },
      images: data.images || []
    } as any
    
    const project = await prisma.project.create({
      data: createData
    })

    return this.mapPrismaToDatabase(project)
  }

  async update(data: UpdateProjectData): Promise<DatabaseProject> {
    const { id, ...updateData } = data
    
    const updatePayload: Record<string, unknown> = { ...updateData }
    
    if (updateData.slug) {
      updatePayload.slug = updateData.slug // Persistir slug si se proporciona
    }
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
      slug: project.slug,
      architect: project.architect,
      location: project.location,
      year: project.year,
      description: project.description,
      challenge: project.challenge,
      solution: project.solution,
      result: project.result,
      category: project.category as Category,
      type: project.type,
      area: project.area,
      coverImage: project.coverImage as unknown as ProjectImage,
      images: project.images as unknown as ProjectImage[],
      specs: this.mapPrismaSpecsToProjectSpecs(project.specs),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }
  }

  private mapPrismaSpecsToProjectSpecs(prismaSpecs: unknown): ProjectSpecs {
    const specs = prismaSpecs as Record<string, unknown>

    return {
      system: (specs.system as string) || '',
      foundations: (specs.foundations as string) || '',
      structure: (specs.structure as string) || '',
      normative: (specs.normative as string) || ''
    }
  }
}