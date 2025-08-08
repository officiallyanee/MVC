CREATE TABLE `orders`(
    `order_id` VARCHAR(255) NOT NULL,
    `customer_id` VARCHAR(255) NOT NULL,
    `table_no` BIGINT NOT NULL,
    `specifications` TEXT NULL,
    `ordered_time` DATETIME NOT NULL,
    `received_time` DATETIME NULL,
    `total_fare` FLOAT(53) NOT NULL,
    `payment_status` ENUM('paid','pending') NOT NULL,
    PRIMARY KEY(`order_id`)
);
ALTER TABLE
    `orders` ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `login_details`(`user_id`);