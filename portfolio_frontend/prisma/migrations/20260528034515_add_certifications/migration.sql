-- CreateTable
CREATE TABLE `Certification` (
    `id` VARCHAR(191) NOT NULL,
    `portfolioId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NOT NULL,
    `issueDate` VARCHAR(191) NULL,
    `credentialUrl` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Certification` ADD CONSTRAINT `Certification_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
