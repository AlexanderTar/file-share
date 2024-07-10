### File Sharing App

This is a simple file sharing app that allows users to upload files and share them with others. The app is built with Next.js and uses Vercel for storage (Postgres and Blob).

## Features

- Upload files and generate a unique link to share with others. Optionally, you can add metadata to the file share such as expiration date, password protection and a custom name
- View files shared with you by others
- Edit existing shares by adding more files or changing the metadata

## Tech Stack

- Next.js
- Vercel Serverless Functions
- Postgres with Prisma ORM
- Vercel Blob Storage

## Local Development

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000/share](http://localhost:3000/share) with your browser to see the result.

When your local website is served on http://localhost:3000, then the file upload webhook is not available and functionality is limited. In order to benefit from the full functionality it is recommended to use a tunneling service like [ngrok](https://ngrok.com/)

## Deployment

Deployment is done automatically on Vercel once the code is pushed to the main branch.

## What's missing

- Tests
- The app is not tested with large files. The file is uploaded to the blob storage directly using the Vercel API
- There is some code duplication that could be refactored, in particular with regards to creating the share and updating the existing share
- Error handling is very basic. There are error messages displayed to the user but they may not be very user-friendly
- The UI is very basic and could be improved with extra transitions and effects. Thumbnails and previews are only available for images
- The app is not optimized for mobile
- Password protection is currently not implemented
- The app is not localized
- Styling is very basic
