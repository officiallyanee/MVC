ALTER TABLE `sub_orders`
  drop FOREIGN KEY `sub_orders_order_id_foreign`;
ALTER TABLE `sub_orders`
  drop FOREIGN KEY `sub_orders_chef_id_foreign`;
DROP TABLE IF EXISTS `sub_orders`;