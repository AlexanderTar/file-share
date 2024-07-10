-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contentType" TEXT,
    "url" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareId" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares" (
    "id" SERIAL NOT NULL,
    "shareId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT,

    CONSTRAINT "shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_url_key" ON "files"("url");

-- CreateIndex
CREATE UNIQUE INDEX "shares_shareId_key" ON "shares"("shareId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "shares"("id") ON DELETE SET NULL ON UPDATE CASCADE;
