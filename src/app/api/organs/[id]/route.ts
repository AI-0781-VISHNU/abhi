import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const organ = await prisma.organ.findUnique({
      where: { id: params.id },
      include: {
        metrics: true,
        images: true,
      },
    })

    if (!organ) {
      return NextResponse.json({ error: 'Organ not found' }, { status: 404 })
    }

    return NextResponse.json(organ)
  } catch (error) {
    console.error('Error fetching organ:', error)
    return NextResponse.json({ error: 'Failed to fetch organ' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.organ.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Organ deleted successfully' })
  } catch (error) {
    console.error('Error deleting organ:', error)
    return NextResponse.json({ error: 'Failed to delete organ' }, { status: 500 })
  }
}
