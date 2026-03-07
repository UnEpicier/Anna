-- CreateTable
CREATE TABLE "Informations" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "actionAddress" TEXT,
    "actionLong" DOUBLE PRECISION,
    "actionLat" DOUBLE PRECISION,
    "actionRadius" INTEGER,
    "facebook" TEXT,
    "instagram" TEXT,
    "notifyLeave" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "geojson" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Schedules" (
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("day")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPosts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "illustrationUrl" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogCategoriesToBlogPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlogCategoriesToBlogPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPosts_title_key" ON "BlogPosts"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPosts_uri_key" ON "BlogPosts"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategories_name_key" ON "BlogCategories"("name");

-- CreateIndex
CREATE INDEX "_BlogCategoriesToBlogPosts_B_index" ON "_BlogCategoriesToBlogPosts"("B");

-- AddForeignKey
ALTER TABLE "_BlogCategoriesToBlogPosts" ADD CONSTRAINT "_BlogCategoriesToBlogPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCategoriesToBlogPosts" ADD CONSTRAINT "_BlogCategoriesToBlogPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
