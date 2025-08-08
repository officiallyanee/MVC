CREATE TABLE `sub_orders`(
    `order_id` VARCHAR(255) NOT NULL,
    `item_id` BIGINT UNSIGNED NOT NULL,
    `quantity` INT NOT NULL,
    `chef_id` VARCHAR(255) NULL,
    PRIMARY KEY(`order_id`,`item_id`)
);
ALTER TABLE
    `sub_orders` ADD CONSTRAINT `sub_orders_order_id_foreign` FOREIGN KEY(`order_id`) REFERENCES `orders`(`order_id`);
ALTER TABLE
    `sub_orders` ADD CONSTRAINT `sub_orders_chef_id_foreign` FOREIGN KEY(`chef_id`) REFERENCES `login_details`(`user_id`);