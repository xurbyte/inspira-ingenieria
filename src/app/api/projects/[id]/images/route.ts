import { NextRequest, NextResponse } from 'next/server'
import { getProjectService } from '@/lib/dependency-injection'
import { cloudinaryService } from '@/lib/cloudinary-service'
import { DatabaseProject } from '@/types/database'

async function updateProjectImages(projectId: string, imageToDelete: string): Promise<DatabaseProject | null> {
  try {
    const projectService = getProjectService()
    const project = await projectService.getProjectById(projectId)

    if (!project) {
      return null
    }

    const updatedImages = project.images.filter(img => img.src !== imageToDelete)

    const updatedProject = await projectService.updateProject({
      id: projectId,
      images: updatedImages
    })

    return updatedProject
  } catch (error) {
    console.error('Error updating project images:', error)
    return null
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('imagePath')

    if (!imagePath) {
      return NextResponse.json({ error: 'imagePath parameter is required' }, { status: 400 })
    }

    // Delete from Cloudinary
    const cloudinarySuccess = await cloudinaryService.deleteImage(imagePath)
    if (!cloudinarySuccess) {
      console.warn('Failed to delete image from Cloudinary, but continuing with database update')
    }

    // Update project in database
    const updatedProject = await updateProjectImages(projectId, imagePath)
    if (!updatedProject) {
      return NextResponse.json({ error: 'Failed to update project data' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Image deleted successfully',
      deletedImage: imagePath,
      project: updatedProject
    }, { status: 200 })

  } catch (error) {
    console.error('Error deleting image:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 })
  }
}