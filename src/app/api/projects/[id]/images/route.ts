import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getProjectService } from '@/lib/dependency-injection'
import { DatabaseProject } from '@/types/database'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

async function deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
  try {
    const urlParts = imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    const publicIdWithExtension = filename.split('.')[0]
    
    const folderStartIndex = urlParts.findIndex(part => part === 'inspira-ingenieria')
    if (folderStartIndex === -1) {
      throw new Error('Invalid Cloudinary URL format')
    }
    
    const folderParts = urlParts.slice(folderStartIndex, -1)
    const publicId = `${folderParts.join('/')}/${publicIdWithExtension}`
    
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return false
  }
}

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

    if (imagePath.includes('cloudinary.com')) {
      const cloudinarySuccess = await deleteImageFromCloudinary(imagePath)
      if (!cloudinarySuccess) {
        console.warn('Failed to delete image from Cloudinary, but continuing with database update')
      }
    }

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
