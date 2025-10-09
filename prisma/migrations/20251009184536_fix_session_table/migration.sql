-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_email_settings" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "additionalEmails" TEXT[],
    "sendGridApiKey" TEXT,
    "scheduleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "scheduleTime" TEXT NOT NULL DEFAULT '09:00',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "accessToken" TEXT,
    "lastSent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_email_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_sent_log" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "scheduleTime" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_sent_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_email_settings_shop_key" ON "store_email_settings"("shop");

-- CreateIndex
CREATE INDEX "email_sent_log_shop_sentDate_idx" ON "email_sent_log"("shop", "sentDate");

-- CreateIndex
CREATE UNIQUE INDEX "email_sent_log_shop_scheduleTime_sentDate_key" ON "email_sent_log"("shop", "scheduleTime", "sentDate");
