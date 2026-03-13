import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const execPromise = promisify(exec)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const organ = formData.get('organ') as string || 'General'
    
    // Create a temporary file to store the image for Python to read
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`)
    await fs.writeFile(tempFilePath, buffer)

    try {
      // Execute the Python script
      const scriptPath = path.join(process.cwd(), 'scripts', 'analyze_image.py')
      const { stdout, stderr } = await execPromise(`python3 "${scriptPath}" "${tempFilePath}" --organ "${organ}" --filename "${file.name}"`)

      if (stderr) {
        console.error('Python Stderr:', stderr)
      }

      const results = JSON.parse(stdout)
      
      // Cleanup
      await fs.unlink(tempFilePath)

      return NextResponse.json(results)
    } catch (error) {
      // Cleanup on error
      if (await fs.stat(tempFilePath).catch(() => null)) {
        await fs.unlink(tempFilePath)
      }
      throw error
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Deep analysis failed' }, { status: 500 })
  }
}
