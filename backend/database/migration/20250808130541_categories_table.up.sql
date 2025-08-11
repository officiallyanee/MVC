CREATE TABLE IF NOT EXISTS `categories`(
    `item_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(`category_id`,`item_id`)
);
ALTER TABLE
    `categories` ADD CONSTRAINT `categories_item_id_foreign` FOREIGN KEY(`item_id`) REFERENCES `item_list`(`item_id`);
ALTER TABLE
    `categories` ADD CONSTRAINT `categories_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `category_list`(`category_id`);