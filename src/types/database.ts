import { Category } from './enums'

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectSpecs {
  system: string
  foundations: string
  structure: string
  normative: string
}

export interface DatabaseProject {
  id: string
  title: string
  slug: string
  architect: string
  location: string
  year: string
  description: string
  challenge: string
  solution: string
  result: string
  category: Category
  type: string
  area: string | null
  coverImage: ProjectImage
  images: ProjectImage[]
  specs: ProjectSpecs
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectData {
  title: string
  slug?: string // Agregado como opcional
  architect: string
  location: string
  year: string
  description: string
  challenge: string
  solution: string
  result: string
  category: Category
  type: string
  area?: string
  coverImage?: ProjectImage
  images?: ProjectImage[]
  specs: ProjectSpecs
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}
