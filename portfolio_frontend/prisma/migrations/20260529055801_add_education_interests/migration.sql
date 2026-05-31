-- CreateTable
CREATE TABLE `Education` (
    `id` VARCHAR(191) NOT NULL,
    `portfolioId` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `startYear` VARCHAR(191) NULL,
    `endYear` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interest` (
    `id` VARCHAR(191) NOT NULL,
    `portfolioId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Education` ADD CONSTRAINT `Education_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interest` ADD CONSTRAINT `Interest_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
