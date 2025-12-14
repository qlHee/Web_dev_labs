-- 创建数据库
CREATE DATABASE IF NOT EXISTS quiz DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE quiz;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `user_role` tinyint(1) NOT NULL DEFAULT '0' COMMENT '用户角色：0-普通用户，1-管理员',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 创建题目表
CREATE TABLE IF NOT EXISTS `question` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question` varchar(500) NOT NULL COMMENT '题目内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目表';

-- 创建答案选项表
CREATE TABLE IF NOT EXISTS `answer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) NOT NULL COMMENT '题目ID',
  `text` varchar(500) NOT NULL COMMENT '选项内容',
  `correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否正确答案：0-否，1-是',
  PRIMARY KEY (`id`),
  KEY `idx_question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='答案选项表';

-- 插入初始管理员账户
INSERT INTO `user` (`user_name`, `password`, `user_role`) VALUES ('admin', 'admin123', 1);

-- 插入示例题目和选项
INSERT INTO `question` (`question`) VALUES ('HTML中，用于定义网页标题的标签是？');
SET @question1_id = LAST_INSERT_ID();
INSERT INTO `answer` (`question_id`, `text`, `correct`) VALUES 
(@question1_id, '<title>', 1),
(@question1_id, '<header>', 0),
(@question1_id, '<h1>', 0),
(@question1_id, '<head>', 0);

INSERT INTO `question` (`question`) VALUES ('以下哪个CSS属性用于设置文本颜色？');
SET @question2_id = LAST_INSERT_ID();
INSERT INTO `answer` (`question_id`, `text`, `correct`) VALUES 
(@question2_id, 'text-color', 0),
(@question2_id, 'font-color', 0),
(@question2_id, 'color', 1),
(@question2_id, 'foreground-color', 0);

INSERT INTO `question` (`question`) VALUES ('在JavaScript中，以下哪个语句可以正确地声明一个变量？');
SET @question3_id = LAST_INSERT_ID();
INSERT INTO `answer` (`question_id`, `text`, `correct`) VALUES 
(@question3_id, 'variable x;', 0),
(@question3_id, 'var x;', 1),
(@question3_id, 'x = var;', 0),
(@question3_id, 'declare x;', 0);

INSERT INTO `question` (`question`) VALUES ('以下哪个不是JavaScript的数据类型？');
SET @question4_id = LAST_INSERT_ID();
INSERT INTO `answer` (`question_id`, `text`, `correct`) VALUES 
(@question4_id, 'String', 0),
(@question4_id, 'Boolean', 0),
(@question4_id, 'Character', 1),
(@question4_id, 'Number', 0);

INSERT INTO `question` (`question`) VALUES ('CSS中，哪个属性用于设置元素的内边距？');
SET @question5_id = LAST_INSERT_ID();
INSERT INTO `answer` (`question_id`, `text`, `correct`) VALUES 
(@question5_id, 'margin', 0),
(@question5_id, 'padding', 1),
(@question5_id, 'spacing', 0),
(@question5_id, 'border', 0);
