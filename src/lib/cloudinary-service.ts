import { v2 as cloudinary } from 'cloudinary'
import { DatabaseProject } from '@/types/database'
import { Category } from '@/types/enums'

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

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: options.folder,
          public_id: options.publicId,
          transformation: transformations
        },
        (error, result) => {
          if (error) reject(error)
          else resolve({
            secure_url: result!.secure_url,
            public_id: result!.public_id
          })
        }
      )
      uploadStream.end(buffer)
    })
  }

  /**
   * Uploads multiple files
   */
  public async uploadImages(
    files: File[],
    options: UploadOptions
  ): Promise<CloudinaryUploadResult[]> {
    const uploads = files.map((file, index) => {
      const fileOptions = { ...options }
      if (options.publicId) {
        fileOptions.publicId = `${options.publicId}-${index + 1}`
      }
      return this.uploadImage(file, fileOptions)
    })
    return Promise.all(uploads)
  }

  /**
   * Deletes a single image by URL
   */
  public async deleteImage(url: string): Promise<boolean> {
    try {
      const publicId = this.extractPublicIdFromUrl(url)
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true
      })
      return true
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error)
      return false
    }
  }

  /**
   * Deletes all project images and folders
   */
  public async deleteProjectImages(project: DatabaseProject, category: string): Promise<boolean> {
    const folderPath = this.getProjectFolder(category, project.id)

    try {
      // Delete resources by prefix
      await cloudinary.api.delete_resources_by_prefix(folderPath, {
        type: 'upload',
        resource_type: 'image'
      })

      // Delete subfolders
      const subfolders = ['cover', 'images']
      for (const subfolder of subfolders) {
        try {
          await cloudinary.api.delete_folder(`${folderPath}/${subfolder}`)
        } catch {
          // Ignore if not exist
        }
      }

      // Delete main folder
      try {
        await cloudinary.api.delete_folder(folderPath)
      } catch {
        // Ignore
      }

      return true
    } catch (error) {
      console.error('Error deleting project images from Cloudinary:', error)
      return false
    }
  }

  /**
   * Gets resources by prefix
   */
  public async getResourcesByPrefix(prefix: string): Promise<any[]> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix,
        max_results: 500
      })
      return result.resources || []
    } catch (error) {
      console.error('Error getting resources:', error)
      return []
    }
  }

  /**
   * Renames a resource
   */
  public async renameResource(oldPublicId: string, newPublicId: string): Promise<boolean> {
    try {
      await cloudinary.uploader.rename(oldPublicId, newPublicId, {
        resource_type: 'image',
        invalidate: true
      })
      return true
    } catch (error) {
      console.error('Error renaming resource:', error)
      return false
    }
  }

  /**
   * Updates cover image - deletes old if exists and uploads new
   */
  public async updateCoverImage(
    oldImageUrl: string,
    newFile: File,
    category: string,
    projectId: string
  ): Promise<CloudinaryUploadResult> {
    // Delete old if Cloudinary URL
    if (oldImageUrl.includes('cloudinary.com')) {
      const deleteSuccess = await this.deleteImage(oldImageUrl)
      if (!deleteSuccess) {
        console.warn('Failed to delete old cover image')
      }
    }

    // Upload new
    const folder = `${this.getProjectFolder(category, projectId)}/cover`
    return await this.uploadImage(newFile, {
      folder,
      publicId: 'cover'
    })
  }

  /**
   * Uploads additional project images
   */
  public async uploadProjectImages(
    files: File[],
    category: string,
    projectId: string,
    startIndex: number = 0
  ): Promise<CloudinaryImageData[]> {
    if (files.length === 0) return []

    const folder = `${this.getProjectFolder(category, projectId)}/images`

    const uploadResults = await Promise.all(
      files.map((file, index) => this.uploadImage(file, {
        folder,
        publicId: `image-${startIndex + index + 1}`
      }))
    )

    return uploadResults.map((result, index) => ({
      src: result.secure_url,
      alt: `Project image ${startIndex + index + 1}`
    }))
  }

  /**
   * Extracts public_id from Cloudinary URL
   */
  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/upload/')
    if (parts.length < 2) throw new Error('Invalid Cloudinary URL')
    const versionPath = parts[1].replace(/v\d+\//, '')
    return versionPath.replace(/\.\w+$/, '')
  }

  /**
   * Gets folder path for a project
   */
  public getProjectFolder(category: string | Category, projectId: string): string {
    const categoryString = typeof category === 'string' ? category.toLowerCase() : this.getCategoryStringFromEnum(category)
    const categoryFolder = this.CATEGORY_FOLDER_MAP[categoryString] || categoryString
    return `inspira-ingenieria/${categoryFolder}/${projectId}`
  }

  private getCategoryStringFromEnum(category: Category): string {
    const categoryEnumToString: { [key in Category]: string } = {
      [Category.VIVIENDAS]: 'viviendas',
      [Category.NAVES_INDUSTRIALES]: 'naves-industriales',
      [Category.FUNCIONAL]: 'funcional'
    }
    return categoryEnumToString[category]
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