import { getProjectService } from '@/lib/dependency-injection'
import { CreateProjectData } from '@/types/database'
import fs from 'fs'
import path from 'path'

async function main() {
  try {
    const projectService = getProjectService()
    
    // Read the JSON file
    const filePath = path.resolve(__dirname, '../projects_202509231457.json')
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const { projects } = JSON.parse(rawData)
    
    // Iterate over each project
    for (const projectData of projects) {
      // Map the project data to CreateProjectData
      const createData: CreateProjectData = {
        title: projectData.title,
        architect: projectData.architect,
        location: projectData.location,
        year: projectData.year,
        description: projectData.description,
        challenge: projectData.challenge,
        solution: projectData.solution,
        result: projectData.result,
        category: projectData.category as any, // Cast to enum
        type: projectData.type,
        area: projectData.area || undefined,
        specs: projectData.specs ? JSON.parse(projectData.specs) : {},
        // Skip images for now
      }
      
      // Create the project
      const project = await projectService.createProject(createData)
      console.log(`Created project: ${project.title}`)
    }
    
    console.log('Import completed successfully')
  } catch (error) {
    console.error('Error importing projects:', error)
  }
}

main()
