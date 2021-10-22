CREATE TABLE `my_db_01`.`en_articles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `cover_img` VARCHAR(255) NOT NULL,
  `pub_date` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0,
  `cate_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = '文章信息';