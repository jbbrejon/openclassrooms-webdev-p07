-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: oc_groupomania
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `postId` varchar(255) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (3,'3','2','Merci Jean-Baptiste!','2022-04-25 04:49:24','2022-04-25 04:55:29'),(4,'5','2','Merci à toi!','2022-04-25 05:07:24','2022-04-25 05:07:24'),(5,'1','3','Merci. A toi aussi !','2022-04-25 05:11:47','2022-04-25 05:11:47'),(6,'1','5','Good luck, bro!','2022-04-25 05:27:29','2022-04-25 09:20:21'),(7,'3','5','Bon courage, Garth!','2022-04-25 05:30:40','2022-04-25 05:30:40'),(8,'3','4','Je ne ferrai aucun commentaire ...','2022-04-25 05:31:01','2022-04-25 09:21:48'),(9,'1','4','Moi j\'ai bien envie d\'en faire des commentaires ! ?','2022-04-25 09:22:04','2022-04-25 09:22:04'),(10,'5','6','On est à fond, boss !','2022-04-25 11:46:04','2022-04-25 11:46:04'),(11,'10','5','Hello','2022-04-25 13:31:48','2022-04-25 13:31:48');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,'1','Bienvenue sur le site. J\'espère que vous apprécierez échanger sur cette espace dans la bonne humeur et la bienveillance!','http://localhost:3000/images/helloworld.gif1650723795311.gif','2022-04-23 14:23:15','2022-04-25 09:19:17'),(3,'3','C\'est lundi. Bon début de semaine à tous !','http://localhost:3000/images/8vgm.gif1650863356007.gif','2022-04-25 05:09:16','2022-04-25 05:11:34'),(4,'6','C\'est lundi. J\'ai pris un jour de repos. Bon courage à ceux qui bossent ! :D','http://localhost:3000/images/american_psycho.jpg1650885012670.jpeg','2022-04-25 05:15:55','2022-04-25 11:10:12'),(5,'5','Quand t\'arrives lundi matin et qu\'il y a déjà plein de tickets dans le backlog!','http://localhost:3000/images/why-arewe-still-here-mgs-video-game.gif1650864179715.gif','2022-04-25 05:22:59','2022-04-25 05:24:52'),(6,'9','Bonjour à tous! Je vois que ça bosse !','http://localhost:3000/images/work-hard-jim-carrey.gif1650887104441.gif','2022-04-25 11:45:04','2022-04-25 11:45:04');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jeanbaptiste.brejon@groupomania.com','$2b$10$kyrcMB.rlfb9CWiGmpv7CuLBb4SmjDd/YcgPgbfLUYDJZgBupWMNu','Jean-Baptiste','BREJON','Developpeur Web','http://localhost:3000/images/profile.png1650633326785.png',1,'2022-04-22 13:13:34','2022-04-24 12:30:53'),(2,'openclassrooms@groupomania.com','$2b$10$lnHoShAJldzEIC5/U0aWdORGMAKdvMlU0PNEoJXjgTRS9mxKMnBGK','Evaluateur','OPENCLASSROOMS','Mentor évaluateur','http://localhost:3000/images/openclassrooms.png1650633653570.png',0,'2022-04-22 13:19:22','2022-04-22 13:20:53'),(3,'felicity.smoak@groupomania.com','$2b$10$7g/rs2Y3Sdxh8LerAPGQlO1buvrVknGVUHdCt2g.LJlIsE3hnjvHe','Felicity','SMOAK','DRH','http://localhost:3000/images/felicity-smoak.png1650862414572.png',0,'2022-04-25 04:49:06','2022-04-25 04:54:06'),(5,'garth.algar@groupomania.com','$2b$10$TWNWt4bfRqmW1a4yOXf0suxQQbWLcQPaaZ4JsH1sAPfP4t5hPB56i','Garth','ALGAR','Technicien Support','http://localhost:3000/images/garth-algar.jpg1650863225766.jpeg',0,'2022-04-25 05:05:47','2022-04-25 05:21:20'),(6,'patrick.bateman@groupomania.com','$2b$10$CKlp6JNsWYTffwr/SGLrT.yvo1VXpPh849L/vhAJl60CrKZv.3m9S','Patrick','BATEMAN','Directeur financier','http://localhost:3000/images/patrick-bateman.png1650863949747.png',0,'2022-04-25 05:15:19','2022-04-25 05:19:09'),(9,'elon.musk@groupomania.com','$2b$10$QX6HYbzsbEmtl3YUirwMI.EVj.AXklDHKiO8Wjy7i7KLnnTqqS/.O','Elon','MUSK','CEO','http://localhost:3000/images/elon-musk.jpg1650887008063.jpeg',0,'2022-04-25 11:40:46','2022-04-25 11:43:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-25 16:08:07
