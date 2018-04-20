/*
Navicat MariaDB Data Transfer

Source Server         : dsmdb
Source Server Version : 100032
Source Host           : 192.168.2.127:3307
Source Database       : WX

Target Server Type    : MariaDB
Target Server Version : 100032
File Encoding         : 65001

Date: 2018-04-20 08:04:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` bigint(20) NOT NULL AUTO_INCREMENT,
  `openid` varchar(32) DEFAULT NULL,
  `session_key` varchar(32) DEFAULT NULL,
  `session_3rd` varchar(32) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `mobilephone` varchar(13) DEFAULT NULL,
  `level` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
