-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(35) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `password` VARCHAR(150) NOT NULL,
    `avatar` VARCHAR(255) NOT NULL DEFAULT '/media/default-avatar.svg',
    `details` VARCHAR(512) NOT NULL,
    `likes` INTEGER NOT NULL,
    `activity` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `user_name_key`(`name`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follower` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blocked_user` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_member` (
    `id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `communityID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(35) NOT NULL,
    `details` VARCHAR(512) NOT NULL,
    `memberID` VARCHAR(191) NULL,

    UNIQUE INDEX `community_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `body` VARCHAR(800) NULL,
    `likes` INTEGER NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `communityID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(255) NULL,
    `caption` VARCHAR(150) NULL,
    `alt` VARCHAR(150) NULL,
    `postID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(255) NULL,
    `caption` VARCHAR(150) NULL,
    `alt` VARCHAR(150) NULL,
    `postID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interest` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(35) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dm` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `directMessageID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `postID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reaction` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `commentID` VARCHAR(191) NULL,
    `messageID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_InterestToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_InterestToUser_AB_unique`(`A`, `B`),
    INDEX `_InterestToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DMToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DMToUser_AB_unique`(`A`, `B`),
    INDEX `_DMToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follower` ADD CONSTRAINT `follower_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blocked_user` ADD CONSTRAINT `blocked_user_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_member` ADD CONSTRAINT `community_member_communityID_fkey` FOREIGN KEY (`communityID`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_member` ADD CONSTRAINT `community_member_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community` ADD CONSTRAINT `community_memberID_fkey` FOREIGN KEY (`memberID`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_communityID_fkey` FOREIGN KEY (`communityID`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video` ADD CONSTRAINT `video_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_directMessageID_fkey` FOREIGN KEY (`directMessageID`) REFERENCES `dm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postID_fkey` FOREIGN KEY (`postID`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reaction` ADD CONSTRAINT `reaction_commentID_fkey` FOREIGN KEY (`commentID`) REFERENCES `comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reaction` ADD CONSTRAINT `reaction_messageID_fkey` FOREIGN KEY (`messageID`) REFERENCES `message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterestToUser` ADD FOREIGN KEY (`A`) REFERENCES `interest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterestToUser` ADD FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DMToUser` ADD FOREIGN KEY (`A`) REFERENCES `dm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DMToUser` ADD FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
