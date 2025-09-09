import { NextResponse } from 'next/server'
import { container } from '@/lib/dependency-injection'
import { ProjectRepository } from '@/repositories/project.repository'

export async function GET() {
  try {
    const projectRepository = container.resolve<ProjectRepository>('ProjectRepository')
    
    // Fetch all projects in a single database query
    const allProjects = await projectRepository.findAll()
    
    return NextResponse.json({
      success: true,
      projects: allProjects,
      count: allProjects.length
    })
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar proyectos',
        projects: []
      },
      { status: 500 }
    )
  }
}
