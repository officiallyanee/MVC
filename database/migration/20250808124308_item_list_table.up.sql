CREATE TABLE `item_list`(
    `item_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price_per_item` FLOAT(53) NOT NULL,
    `description` TEXT NOT NULL,
    `availablity` BOOLEAN NOT NULL DEFAULT '1',
    `image_url` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`item_id`)
);