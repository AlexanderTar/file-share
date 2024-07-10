import { ShareRequest } from '@/app/_types/share'
import { NextResponse, type NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

/*
 * POST /api/share
 * Create a new share
 */
export async function POST(request: NextRequest) {
  const data = (await request.json()) as ShareRequest

  try {
    const shareId = uuidv4().replaceAll('-', '')

    const files = await prisma.file.findMany({
      where: {
        url: {
          in: data.files.map((file) => file.url),
        },
      },
    })

    if (files.length !== data.files.length) {
      return NextResponse.json({ error: 'Invalid files' }, { status: 400 })
    }

    const share = await prisma.share.create({
      data: {
        shareId: shareId,
        name: data.name,
        expiresAt: new Date(data.expiresAt),
        files: {
          connect: files,
        },
      },
    })

    return NextResponse.json({
      id: share.shareId,
      name: share.name,
      files: files.map((file) => ({
        name: file.name,
        url: file.url,
        contentType: file.contentType,
        downloadUrl: file.downloadUrl,
        size: file.size,
      })),
      expiresAt: share.expiresAt.getTime(),
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
