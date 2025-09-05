import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Project } from '@/types/project'

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

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

async function updateProjectsJson(category: string, project: Project): Promise<boolean> {
  const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)

  try {
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)

    projects.push(project)

    await writeFile(jsonPath, JSON.stringify(projects, null, 2))

    return true
  } catch (error) {
    console.error('Error updating JSON file:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const projectId = generateId(title)

    const coverImageFile = formData.get('coverImage') as File
    if (!coverImageFile) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 })
    }

    const categoryFolderMap: { [key: string]: string } = {
      'viviendas': 'Vivienda',
      'naves-industriales': 'Nave industrial',
      'funcional': 'Funcional'
    }

    const categoryFolder = categoryFolderMap[category] || category

    const coverImagePath = await saveUploadedFile(coverImageFile, categoryFolder, projectId, 'portada')

    const detailImages: string[] = []
    let imageIndex = 0

    while (true) {
      const detailImageFile = formData.get(`detailImage_${imageIndex}`) as File
      if (!detailImageFile) break

      const detailImagePath = await saveUploadedFile(detailImageFile, categoryFolder, projectId, 'adentro')
      detailImages.push(detailImagePath)
      imageIndex++
    }

    const newProject: Project = {
      id: projectId,
      title,
      architect,
      location,
      year,
      system,
      type: type as Project['type'],
      area,
      coverImage: {
        src: coverImagePath,
        alt: `${title} - Vista exterior`
      },
      images: detailImages.map((src, index) => ({
        src,
        alt: `${title} - Detalle ${index + 1}`
      })),
      description,
      challenge,
      solution,
      result,
      specs: {
        system,
        foundations: 'Por definir',
        structure: 'Por definir',
        normative: 'CIRSOC'
      }
    }

    const success = await updateProjectsJson(category, newProject)

    if (!success) {
      return NextResponse.json({ error: 'Failed to save project data' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Project created successfully',
      project: newProject
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }

    const jsonPath = path.join(process.cwd(), 'src', 'data', `${category}.json`)
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const projects = JSON.parse(jsonContent)

    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
