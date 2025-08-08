CREATE TABLE `login_details`(
    `user_id` VARCHAR(255) NOT NULL PRIMARY KEY, 
    `name` CHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `pwd_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('customer','chef','admin') NOT NULL,
     UNIQUE (`name`)
);