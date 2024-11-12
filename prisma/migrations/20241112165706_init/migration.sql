-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('click', 'scan');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('open', 'paid', 'uncollectible', 'void');

-- CreateEnum
CREATE TYPE "QrType" AS ENUM ('standard', 'ai');

-- CreateEnum
CREATE TYPE "LogoType" AS ENUM ('qryptic', 'team', 'custom');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L', 'M', 'Q', 'H');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'member', 'billing', 'viewer');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" TIMESTAMP(3),
    "destination" TEXT,
    "isSubdomain" BOOLEAN NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "ip" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "countryRegion" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "browserVersion" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "deviceVendor" TEXT NOT NULL,
    "browserEngine" TEXT NOT NULL,
    "browserEngineVersion" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "osVersion" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "referrerDomain" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "linkId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "stripeInvoiceId" TEXT NOT NULL,
    "number" TEXT,
    "amount" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "invoicePdf" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "name" TEXT,
    "destination" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "passwordHash" TEXT,
    "expiresAt" TIMESTAMP(3),
    "shouldCloak" BOOLEAN NOT NULL DEFAULT false,
    "shouldIndex" BOOLEAN NOT NULL DEFAULT false,
    "shouldProxy" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "ios" TEXT,
    "android" TEXT,
    "expired" TEXT,
    "geo" JSONB,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "teamId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isLegacy" BOOLEAN NOT NULL DEFAULT false,
    "links" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "domains" INTEGER NOT NULL,
    "analytics" INTEGER NOT NULL,
    "supportLevel" TEXT NOT NULL,
    "sla" BOOLEAN NOT NULL,
    "slaContract" TEXT,
    "sso" BOOLEAN NOT NULL,
    "rbac" BOOLEAN NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "QrType" NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "logo" TEXT,
    "logoType" "LogoType",
    "logoWidth" DOUBLE PRECISION,
    "logoHeight" DOUBLE PRECISION,
    "level" "Level" NOT NULL,
    "image" TEXT,
    "prompt" TEXT,
    "linkId" TEXT NOT NULL,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "company" TEXT,
    "emailInvoiceTo" TEXT,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "failedInvoiceId" TEXT,
    "planId" TEXT NOT NULL,
    "priceId" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "paymentMethodId" TEXT,
    "paymentMethodType" TEXT,
    "paymentMethodBrand" TEXT,
    "paymentMethodLast4" TEXT,
    "paymentMethodExpMonth" INTEGER,
    "paymentMethodExpYear" INTEGER,
    "inviteToken" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'member',
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "emailToken" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "hashedPassword" TEXT,
    "resetPasswordToken" TEXT,
    "twoFactor" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "googleAuth" BOOLEAN NOT NULL DEFAULT false,
    "credentialsAuth" BOOLEAN NOT NULL DEFAULT false,
    "hasUsedTrial" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnabledDefaultDomains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LinkToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeInvoiceId_key" ON "Invoice"("stripeInvoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Price_stripePriceId_key" ON "Price"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_linkId_key" ON "QrCode"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Team_stripeCustomerId_key" ON "Team"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_inviteToken_key" ON "Team"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_EnabledDefaultDomains_AB_unique" ON "_EnabledDefaultDomains"("A", "B");

-- CreateIndex
CREATE INDEX "_EnabledDefaultDomains_B_index" ON "_EnabledDefaultDomains"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToTag_AB_unique" ON "_LinkToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToTag_B_index" ON "_LinkToTag"("B");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnabledDefaultDomains" ADD CONSTRAINT "_EnabledDefaultDomains_A_fkey" FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnabledDefaultDomains" ADD CONSTRAINT "_EnabledDefaultDomains_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToTag" ADD CONSTRAINT "_LinkToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToTag" ADD CONSTRAINT "_LinkToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
