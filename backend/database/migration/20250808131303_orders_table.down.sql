ALTER TABLE `orders`
  drop FOREIGN KEY `orders_customer_id_foreign`;
DROP TABLE IF EXISTS `orders`;