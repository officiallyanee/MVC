ALTER TABLE `categories`
  drop FOREIGN KEY `categories_item_id_foreign`;
ALTER TABLE `categories`
  drop FOREIGN KEY `categories_category_id_foreign`;
DROP TABLE IF EXISTS `categories`;