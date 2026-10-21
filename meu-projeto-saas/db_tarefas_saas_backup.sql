-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_tarefas_saas
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tarefas`
--

DROP TABLE IF EXISTS `tarefas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tarefas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `concluida` tinyint(1) DEFAULT 0,
  `prioridade` enum('Baixa','Media','Alta') DEFAULT 'Media',
  `data_vencimento` date DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  `concluido_em` datetime DEFAULT NULL,
  `usuario_id` int(11) DEFAULT 1,
  `atualizado_por` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `atualizado_por` (`atualizado_por`),
  CONSTRAINT `tarefas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tarefas_ibfk_2` FOREIGN KEY (`atualizado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas`
--

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` VALUES (10,'Alfa',0,'Media',NULL,'2026-10-20 08:25:35',NULL,1,1),(11,'Bravo',0,'Media',NULL,'2026-10-20 08:25:37',NULL,1,1),(12,'Charlie',0,'Media',NULL,'2026-10-20 08:25:46',NULL,1,1),(13,'Delta',0,'Media',NULL,'2026-10-20 08:25:50',NULL,1,1),(14,'Echo',0,'Media',NULL,'2026-10-20 08:25:55',NULL,1,1),(15,'Foxtrot',0,'Media',NULL,'2026-10-20 08:26:03',NULL,1,1),(16,'Golf',0,'Media',NULL,'2026-10-20 08:26:07',NULL,1,1),(17,'Hotel',0,'Media',NULL,'2026-10-20 08:26:11',NULL,1,1),(18,'India',0,'Media',NULL,'2026-10-20 08:26:14',NULL,1,1),(19,'Juliet',0,'Media',NULL,'2026-10-20 08:26:20',NULL,1,1),(20,'Kilo',0,'Media',NULL,'2026-10-20 08:26:24',NULL,1,1),(21,'Lima',0,'Media',NULL,'2026-10-20 08:26:28',NULL,1,1),(22,'Mike',0,'Media',NULL,'2026-10-20 08:26:30',NULL,1,1),(23,'November',0,'Media',NULL,'2026-10-20 08:26:34',NULL,1,1),(24,'Oscar',0,'Media',NULL,'2026-10-20 08:26:38',NULL,1,1),(25,'Papa',0,'Media',NULL,'2026-10-20 08:26:41',NULL,1,1),(26,'Quebec',0,'Media',NULL,'2026-10-20 08:26:46',NULL,1,1),(27,'Romeo',0,'Media',NULL,'2026-10-20 08:26:50',NULL,1,1),(28,'Sierra',0,'Media',NULL,'2026-10-20 08:26:56',NULL,1,1),(29,'Tango',0,'Media',NULL,'2026-10-20 08:27:03',NULL,1,1),(30,'Uniform',0,'Media',NULL,'2026-10-20 08:27:11',NULL,1,1),(31,'Victor',0,'Media',NULL,'2026-10-20 08:27:18',NULL,1,1),(32,'Whiskey',0,'Media',NULL,'2026-10-20 08:27:31',NULL,1,1),(33,'X-ray',0,'Media',NULL,'2026-10-20 08:27:48',NULL,1,1),(34,'Yankee',0,'Media',NULL,'2026-10-20 08:27:57',NULL,1,1),(39,'Zulu',0,'Media',NULL,'2026-10-20 08:44:37',NULL,1,1),(51,'a',0,'Media',NULL,'2026-10-20 09:21:16',NULL,1,1),(52,'b',0,'Media',NULL,'2026-10-20 09:21:17',NULL,1,1),(53,'c',0,'Media',NULL,'2026-10-20 09:21:18',NULL,1,1),(54,'d',0,'Media',NULL,'2026-10-20 09:21:19',NULL,1,1),(55,'e',0,'Media',NULL,'2026-10-20 09:21:20',NULL,1,1),(56,'f',0,'Media',NULL,'2026-10-20 09:21:21',NULL,1,1),(57,'g',0,'Media',NULL,'2026-10-20 09:21:22',NULL,1,1),(58,'h',0,'Media',NULL,'2026-10-20 09:21:23',NULL,1,1),(60,'i',0,'Media',NULL,'2026-10-20 09:21:29',NULL,1,1),(61,'j',0,'Media',NULL,'2026-10-20 09:21:30',NULL,1,1),(62,'k',0,'Media',NULL,'2026-10-20 09:21:30',NULL,1,1),(63,'l',0,'Media',NULL,'2026-10-20 09:21:30',NULL,1,1),(64,'m',0,'Media',NULL,'2026-10-20 09:21:31',NULL,1,1),(65,'n',0,'Media',NULL,'2026-10-20 09:21:32',NULL,1,1),(66,'o',0,'Media',NULL,'2026-10-20 09:21:35',NULL,1,1),(67,'p',0,'Media',NULL,'2026-10-20 09:21:37',NULL,1,1),(68,'q',0,'Media',NULL,'2026-10-20 09:21:38',NULL,1,1),(70,'r',0,'Media',NULL,'2026-10-20 09:21:44',NULL,1,1),(71,'s',0,'Media',NULL,'2026-10-20 09:21:45',NULL,1,1),(72,'t',0,'Media',NULL,'2026-10-20 09:21:46',NULL,1,1),(73,'u',0,'Media',NULL,'2026-10-20 09:21:48',NULL,1,1),(74,'v',0,'Media',NULL,'2026-10-20 09:21:49',NULL,1,1),(75,'w',0,'Media',NULL,'2026-10-20 09:21:50',NULL,1,1),(76,'x',0,'Media',NULL,'2026-10-20 09:21:51',NULL,1,1),(77,'y',0,'Media',NULL,'2026-10-20 09:21:52',NULL,1,1),(78,'z',0,'Media',NULL,'2026-10-20 09:21:53',NULL,1,1),(90,'a',0,'Media',NULL,'2026-10-20 11:32:35',NULL,3,3),(94,'sdf',0,'Media',NULL,'2026-10-20 11:47:20',NULL,3,3),(95,'fg',0,'Media',NULL,'2026-10-20 11:47:20',NULL,3,3),(96,'hj',0,'Media',NULL,'2026-10-20 11:47:21',NULL,3,3),(97,'hf',0,'Media',NULL,'2026-10-20 11:47:22',NULL,3,3),(98,'fghs',0,'Media',NULL,'2026-10-20 11:47:23',NULL,3,3),(99,'sdfh',0,'Media',NULL,'2026-10-20 11:47:24',NULL,3,3),(100,'sghfg',0,'Media',NULL,'2026-10-20 11:47:31',NULL,3,3),(101,'shsd',0,'Media',NULL,'2026-10-20 11:47:32',NULL,3,3),(102,'fdgsdfh',0,'Media',NULL,'2026-10-20 11:47:33',NULL,3,3),(103,'sdfhsd',0,'Media',NULL,'2026-10-20 11:47:34',NULL,3,3),(104,'saf',0,'Media',NULL,'2026-10-20 11:55:53',NULL,3,3),(105,'asfas',0,'Media',NULL,'2026-10-20 11:55:54',NULL,3,3),(106,'fas',0,'Media',NULL,'2026-10-20 11:55:54',NULL,3,3),(107,'as',0,'Media',NULL,'2026-10-20 11:55:55',NULL,3,3),(108,'das',0,'Media',NULL,'2026-10-20 11:55:56',NULL,3,3),(109,'aas',0,'Media',NULL,'2026-10-20 11:55:57',NULL,3,3),(110,'saas',1,'Media',NULL,'2026-10-20 11:55:59','2026-10-20 12:04:56',3,3),(111,'alfasa',1,'Media',NULL,'2026-10-20 11:56:04','2026-10-20 12:04:57',3,3),(112,'sss',1,'Media',NULL,'2026-10-20 11:56:38','2026-10-20 12:04:55',3,3);
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `senha_hash` varchar(255) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Tech Lead SaaS','teste@saas.com',NULL,'$2a$10$X72k15YqZg7oK02Y67zLXeUeD9U/C2fDsmXvHeG7nS6R2hE9N2C6a','2026-10-19 14:14:46'),(2,'Alfa','alfa@saas.com',NULL,'$2b$10$HuCLr0i0FOrXHcbzq/hetetMRzhDow/q9BlCoCXXrqQGbU5e1mXHy','2026-10-19 14:29:39'),(3,'Tech Lead SaaS','techlead@saas.com','mock_google_id_12345',NULL,'2026-10-20 15:02:53');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20 16:04:39
