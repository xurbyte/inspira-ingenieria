import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Project, ProjectImage } from '@/types/project'

async function saveUploadedFile(file: File, category: string, projectId: string, type: 'portada' | 'adentro'): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const projectDir = path.join(process.cwd(), 'public', 'proyectos', category, projectId, type)

  if (!existsSync(projectDir)) {
    await mkdir(projectDir, { recursive: true })
  }
  const extension = path.extname(file.name)
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`
  const filepath = path.join(projectDir, filename)
  await writeFile(filepath, buffer)
  return `/proyectos/${category}/${projectId}/${type}/${filename}`
}

async function updateProjectInJson(category: string, projectId: string, updatedProject: Project) {
  const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
  
  try {
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)
    if (projectIndex === -1) {
      return false
    }
    projects[projectIndex] = updatedProject
    await writeFile(jsonPath, JSON.stringify(projects, null, 2))
    return true
  } catch (error) {
    console.error('Error updating JSON file:', error)
    return false
  }
}

async function deleteProjectFromJson(category: string, projectId: string) {
  const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
  
  try {
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)
    const updatedProjects = projects.filter((p: Project) => p.id !== projectId)
    await writeFile(jsonPath, JSON.stringify(updatedProjects, null, 2))
    return true
  } catch (error) {
    console.error('Error deleting from JSON file:', error)
    return false
  }
}

async function deleteProjectFiles(category: string, projectId: string) {
  const categoryFolderMap: { [key: string]: string } = {
    'viviendas': 'Vivienda',
    'naves-industriales': 'Nave industrial',
    'funcional': 'Funcional'
  }
  
  const categoryFolder = categoryFolderMap[category] || category
  const projectDir = path.join(process.cwd(), 'public', 'proyectos', categoryFolder, projectId)
  
  try {
    if (existsSync(projectDir)) {
      await rm(projectDir, { recursive: true, force: true })
      console.log(`Successfully deleted project directory: ${projectDir}`)
    }
    return true
  } catch (error) {
    console.error('Error deleting project files:', error)
    return false
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const architect = formData.get('architect') as string
    const location = formData.get('location') as string
    const year = formData.get('year') as string
    const system = formData.get('system') as string
    const type = formData.get('type') as string
    const area = formData.get('area') as string
    const description = formData.get('description') as string
    const challenge = formData.get('challenge') as string
    const solution = formData.get('solution') as string
    const result = formData.get('result') as string
    const category = formData.get('category') as string
    
    if (!title || !architect || !location || !year || !system || !type || !area || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)
    const currentProject = projects.find((p: Project) => p.id === projectId)
    
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const categoryFolderMap: { [key: string]: string } = {
      'viviendas': 'Vivienda',
      'naves-industriales': 'Nave industrial',
      'funcional': 'Funcional'
    }
    
    const categoryFolder = categoryFolderMap[category] || category
    
    let coverImagePath = currentProject.coverImage.src
    const coverImageFile = formData.get('coverImage') as File
    if (coverImageFile && coverImageFile.size > 0) {
      coverImagePath = await saveUploadedFile(coverImageFile, categoryFolder, projectId, 'portada')
    }
    
    const detailImages: string[] = [...currentProject.images.map((img: ProjectImage) => img.src)]
    let imageIndex = 0
    
    while (true) {
      const detailImageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!detailImageFile || detailImageFile.size === 0) break
      
      const detailImagePath = await saveUploadedFile(detailImageFile, categoryFolder, projectId, 'adentro')
      detailImages.push(detailImagePath)
      imageIndex++
    }
    
    const updatedProject = {
      ...currentProject,
      title,
      architect,
      location,
      year,
      system,
      type,
      area,
      coverImage: {
        src: coverImagePath,
        alt: `${title} - Vista exterior`
      },
      images: detailImages.map((src: string, index: number): ProjectImage => ({
        src,
        alt: `${title} - Detalle ${index + 1}`
      })),
      description,
      challenge: challenge || '',
      solution: solution || '',
      result: result || '',
      specs: {
        ...currentProject.specs,
        system
      }
    }
    
    const success = await updateProjectInJson(category, projectId, updatedProject)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update project data' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Project updated successfully', 
      project: updatedProject 
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }
    
    const jsonSuccess = await deleteProjectFromJson(category, projectId)
    if (!jsonSuccess) {
      return NextResponse.json({ error: 'Failed to delete project from database' }, { status: 500 })
    }
    
    const filesSuccess = await deleteProjectFiles(category, projectId)
    if (!filesSuccess) {
      console.warn('Failed to delete project files, but project was removed from database')
    }
    
    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
