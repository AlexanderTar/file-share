import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/*
 * POST /api/file
 * Create a new file
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_) => {
        return {}
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('Blob upload completed', blob, tokenPayload)

        try {
          await prisma.file.create({
            data: {
              name: blob.pathname,
              url: blob.url,
              contentType: blob.contentType,
              downloadUrl: blob.downloadUrl,
            },
          })
        } catch (error) {
          console.log('Error creating file', error)
          throw new Error('Could not create file')
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    )
  }
}
