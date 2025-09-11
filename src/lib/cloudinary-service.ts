import { v2 as cloudinary } from 'cloudinary'
import { DatabaseProject } from '@/types/database'

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

export interface CloudinaryImageData {
  src: string
  alt: string
}

export interface CloudinaryTransformation {
  quality?: string
  fetch_format?: string
  width?: number
  height?: number
  crop?: string
  [key: string]: string | number | undefined
}

export interface UploadOptions {
  maxFileSize?: number // in bytes, default 5MB
  allowedTypes?: string[]
  transformations?: CloudinaryTransformation[]
  folder: string
  publicId?: string
}

export class CloudinaryService {
  private static instance: CloudinaryService
  private readonly DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private readonly DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  private readonly DEFAULT_TRANSFORMATIONS: CloudinaryTransformation[] = [
    { quality: 'auto:good', fetch_format: 'auto' },
    { width: 1200, height: 800, crop: 'limit' }
  ]

  private readonly CATEGORY_FOLDER_MAP: { [key: string]: string } = {
    'viviendas': 'viviendas',
    'naves-industriales': 'naves-industriales',
    'funcional': 'funcional'
  }

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService()
    }
    return CloudinaryService.instance
  }

  /**
   * Validates file before upload
   */
  private validateFile(file: File, options: UploadOptions): void {
    const maxFileSize = options.maxFileSize || this.DEFAULT_MAX_FILE_SIZE
    if (file.size > maxFileSize) {
      throw new Error(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB per file.`)
    }

    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File ${file.name} has invalid type. Only ${allowedTypes.join(', ')} are allowed.`)
    }
  }

  /**
   * Uploads a single image to Cloudinary
   */
  public async uploadImage(
    file: File,
    options: UploadOptions
  ): Promise<CloudinaryUploadResult> {
    this.validateFile(file, options)

    const buffer = Buffer.from(await file.arrayBuffer())
    const transformations = options.transformations || this.DEFAULT_TRANSFORMATIONS

    try {
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: options.folder,
            public_id: options.publicId,
            transformation: transformations
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as CloudinaryUploadResult)
          }
        )
        uploadStream.end(buffer)
      })

      return uploadResult
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Uploads multiple images to Cloudinary
   */
  public async uploadImages(
    files: File[],
    options: UploadOptions
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, {
        ...options,
        publicId: options.publicId ? `${options.publicId}-${index + 1}` : undefined
      })
    )

    return Promise.all(uploadPromises)
  }

  /**
   * Extracts public ID from Cloudinary URL
   */
  private extractPublicId(imageUrl: string): string {
    try {
      const urlParts = imageUrl.split('/')
      const filename = urlParts[urlParts.length - 1]
      const publicIdWithExtension = filename.split('.')[0]

      const folderStartIndex = urlParts.findIndex(part => part === 'inspira-ingenieria')
      if (folderStartIndex === -1) {
        throw new Error('Invalid Cloudinary URL format')
      }

      const folderParts = urlParts.slice(folderStartIndex, -1)
      return `${folderParts.join('/')}/${publicIdWithExtension}`
    } catch {
      throw new Error(`Failed to extract public ID from URL: ${imageUrl}`)
    }
  }

  /**
   * Deletes a specific image from Cloudinary
   */
  public async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl.includes('cloudinary.com')) {
        console.warn('Image URL is not a Cloudinary URL, skipping deletion')
        return true
      }

      const publicId = this.extractPublicId(imageUrl)
      await cloudinary.uploader.destroy(publicId)
      return true
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error)
      return false
    }
  }

  /**
   * Deletes all images for a project from Cloudinary
   */
  public async deleteProjectImages(
    project: DatabaseProject,
    category: string
  ): Promise<boolean> {
    try {
      const categoryFolder = this.CATEGORY_FOLDER_MAP[category] || category
      const projectSlug = this.generateProjectSlug(project.title)
      const folderPath = `inspira-ingenieria/${categoryFolder}/${projectSlug}`

      // Delete all resources in the folder
      await cloudinary.api.delete_resources_by_prefix(folderPath)

      // Try to delete subfolders
      const subfolders = ['portada', 'adentro', 'images']
      for (const subfolder of subfolders) {
        try {
          await cloudinary.api.delete_folder(`${folderPath}/${subfolder}`)
        } catch {
          // Ignore errors for subfolders that don't exist
        }
      }

      // Try to delete main folder
      try {
        await cloudinary.api.delete_folder(folderPath)
      } catch {
        // If folder deletion fails, try to delete remaining resources
        try {
          await cloudinary.api.delete_resources_by_prefix(folderPath, {
            type: 'upload',
            resource_type: 'image'
          })
        } catch {
          // Some resources might remain, but that's okay
        }
      }

      return true
    } catch (error) {
      console.error('Error deleting project images from Cloudinary:', error)
      return false
    }
  }

  /**
   * Updates cover image - deletes old one and uploads new one
   */
  public async updateCoverImage(
    oldImageUrl: string,
    newFile: File,
    category: string,
    projectSlug: string
  ): Promise<CloudinaryUploadResult> {
    // Delete old image first
    if (oldImageUrl.includes('cloudinary.com')) {
      const deleteSuccess = await this.deleteImage(oldImageUrl)
      if (!deleteSuccess) {
        console.warn('Failed to delete old cover image, but continuing with upload')
      }
    }

    // Upload new image
    const uploadResult = await this.uploadImage(newFile, {
      folder: `inspira-ingenieria/${category}/${projectSlug}`,
      publicId: 'cover'
    })

    return uploadResult
  }

  /**
   * Uploads additional project images
   */
  public async uploadProjectImages(
    files: File[],
    category: string,
    projectSlug: string,
    startIndex: number = 0
  ): Promise<CloudinaryImageData[]> {
    if (files.length === 0) return []

    const uploadResults = await this.uploadImages(files, {
      folder: `inspira-ingenieria/${category}/${projectSlug}/images`,
      publicId: `image-${startIndex + 1}`
    })

    return uploadResults.map((result, index) => ({
      src: result.secure_url,
      alt: `Project image ${startIndex + index + 1}`
    }))
  }

  /**
   * Generates project slug (utility method)
   */
  private generateProjectSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Gets folder path for a project
   */
  public getProjectFolder(category: string, projectSlug: string): string {
    const categoryFolder = this.CATEGORY_FOLDER_MAP[category] || category
    return `inspira-ingenieria/${categoryFolder}/${projectSlug}`
  }

  /**
   * Validates Cloudinary configuration
   */
  public validateConfiguration(): boolean {
    const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    return required.every(env => process.env[env])
  }
}

// Export singleton instance
export const cloudinaryService = CloudinaryService.getInstance()
