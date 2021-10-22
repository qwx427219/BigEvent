CREATE TABLE `my_db_01`.`en_article_cate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `alias` VARCHAR(255) NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '文章分类是否是被删除\n0 表示 未被删除\n1 表示 已被删除',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  UNIQUE INDEX `alias_UNIQUE` (`alias` ASC) VISIBLE)
COMMENT = '文章分类信息';