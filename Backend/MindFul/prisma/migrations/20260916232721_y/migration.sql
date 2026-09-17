-- CreateTable
CREATE TABLE `journal_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mood` VARCHAR(50) NOT NULL,
    `moodEmoji` VARCHAR(10) NOT NULL,
    `moodColor` VARCHAR(20) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `feeling` TEXT NOT NULL,
    `stressLevel` INTEGER NOT NULL,
    `energyLevel` INTEGER NOT NULL,
    `sleepHours` DOUBLE NOT NULL,
    `tags` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `journal_entries_userId_idx`(`userId`),
    INDEX `journal_entries_userId_dateTime_idx`(`userId`, `dateTime`),
    INDEX `journal_entries_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `journal_entries` ADD CONSTRAINT `journal_entries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
