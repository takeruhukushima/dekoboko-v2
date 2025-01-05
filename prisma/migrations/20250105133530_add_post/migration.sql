-- CreateTable
CREATE TABLE "Post" (
    "rkey" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "postedBy" TEXT NOT NULL,
    "record" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("rkey")
);
