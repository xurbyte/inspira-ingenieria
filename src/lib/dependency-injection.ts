// Dependency Injection Container following SOLID principles
import { ProjectRepository } from '@/repositories/project.repository'
import { ProjectService } from '@/services/project.service'
import { IProjectRepository } from '@/repositories/interfaces/project-repository.interface'
import { IProjectService } from '@/services/interfaces/project-service.interface'

// Singleton pattern for dependency injection
class DIContainer {
  private static instance: DIContainer
  private services: Map<string, unknown> = new Map()

  private constructor() { }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation)
  }
  
  resolve<T>(token: string): T {
    const service = this.services.get(token)
    if (!service) {
      throw new Error(`Service ${token} not found`)
    }
    return service as T
  }

  initialize(): void {
    const projectRepository = new ProjectRepository()
    this.register<IProjectRepository>('ProjectRepository', projectRepository)

    const projectService = new ProjectService(projectRepository)
    this.register<IProjectService>('ProjectService', projectService)
  }
}

export const container = DIContainer.getInstance()

container.initialize()

export const getProjectService = (): IProjectService =>
  container.resolve<IProjectService>('ProjectService')

export const getProjectRepository = (): IProjectRepository =>
  container.resolve<IProjectRepository>('ProjectRepository')
