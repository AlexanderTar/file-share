import { NextResponse, type NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ShareRequest } from '@/app/_types/share'

const prisma = new PrismaClient()

/*
 * GET /api/share/[shareId]
 * Get a share by id
 */
export async function GET(_: NextRequest, { params }: { params: { shareId: string } }) {
  const { shareId } = params

  const share = await prisma.share.findUnique({
    where: {
      shareId,
    },
    include: {
      files: true,
    },
  })

  if (!share) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json({
    id: share.shareId,
    name: share.name,
    files: share.files.map((file) => ({
      name: file.name,
      url: file.url,
      contentType: file.contentType,
      downloadUrl: file.downloadUrl,
    })),
    expiresAt: share.expiresAt.getTime(),
  })
}

/*
 * PUT /api/share/[shareId]
 * Update a share by id
 */
export async function PUT(request: NextRequest, { params }: { params: { shareId: string } }) {
  const { shareId } = params
  const data: ShareRequest = await request.json()

  try {
    const share = await prisma.share.findUnique({
      where: {
        shareId,
      },
    })
    if (!share) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

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
    files.forEach((file) => {
      if (file.shareId !== null && file.shareId !== share.id) {
        return NextResponse.json({ error: 'Invalid files' }, { status: 400 })
      }
    })

    const updated = await prisma.share.update({
      where: {
        shareId,
      },
      data: {
        name: data.name,
        expiresAt: new Date(data.expiresAt),
        password: data.password,
        files: {
          set: files,
        },
      },
    })

    return NextResponse.json({
      id: updated.shareId,
      name: updated.name,
      files: files.map((file) => ({
        name: file.name,
        url: file.url,
        contentType: file.contentType,
        downloadUrl: file.downloadUrl,
      })),
      expiresAt: updated.expiresAt.getTime(),
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
