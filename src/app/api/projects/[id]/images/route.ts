import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Project, ProjectImage } from '@/types/project'

async function updateProjectImages(category: string, projectId: string, imageToDelete: string) {
  const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)

  try {
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)

    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)
    if (projectIndex === -1) {
      return false
    }

    const project = projects[projectIndex]

    if (project.images) {
      project.images = project.images.filter((img: ProjectImage) => img.src !== imageToDelete)
    }

    projects[projectIndex] = project

    await writeFile(jsonPath, JSON.stringify(projects, null, 2))

    return true
  } catch (error) {
    console.error('Error updating project images:', error)
    return false
  }
}

async function deleteImageFile(imagePath: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    if (existsSync(fullPath)) {
      await unlink(fullPath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting image file:', error)
    return false
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const imagePath = searchParams.get('imagePath')

    if (!category || !imagePath) {
      return NextResponse.json({ error: 'Category and imagePath parameters are required' }, { status: 400 })
    }

    const jsonSuccess = await updateProjectImages(category, projectId, imagePath)
    if (!jsonSuccess) {
      return NextResponse.json({ error: 'Failed to update project data' }, { status: 500 })
    }

    await deleteImageFile(imagePath)

    return NextResponse.json({
      message: 'Image deleted successfully',
      deletedImage: imagePath
    }, { status: 200 })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
