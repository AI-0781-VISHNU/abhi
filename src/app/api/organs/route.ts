import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const organs = await prisma.organ.findMany({
      include: {
        metrics: true,
        images: true,
      },
    })
    return NextResponse.json(organs)
  } catch (error) {
    console.error('Error fetching organs:', error)
    return NextResponse.json({ error: 'Failed to fetch organs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, normalCellType, cancerType, description, normalMetrics, cancerMetrics } = body

    const organ = await prisma.organ.create({
      data: {
        name,
        normalCellType,
        cancerType,
        description,
        metrics: {
          create: [
            { isCancer: false, ...normalMetrics },
            { isCancer: true, ...cancerMetrics },
          ],
        },
      },
      include: {
        metrics: true,
      },
    })

    return NextResponse.json(organ)
  } catch (error) {
    console.error('Error creating organ:', error)
    return NextResponse.json({ error: 'Failed to create organ' }, { status: 500 })
  }
}
