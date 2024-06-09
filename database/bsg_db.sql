-- MySQL dump for Games, Genres, and GameGenres

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Table structure for table `Games`
DROP TABLE IF EXISTS `Games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Games` (
  `game_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `dev_ID` int(11) NOT NULL,
  PRIMARY KEY (`game_ID`),
  KEY `dev_ID` (`dev_ID`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`dev_ID`) REFERENCES `Developers` (`dev_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `Games`
LOCK TABLES `Games` WRITE;
/*!40000 ALTER TABLE `Games` DISABLE KEYS */;
INSERT INTO `Games` VALUES (1, 'Game1', 1), (2, 'Game2', 2);
/*!40000 ALTER TABLE `Games` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `Genres`
DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Genres` (
  `genre_ID` int(11) NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(255) NOT NULL,
  PRIMARY KEY (`genre_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `Genres`
LOCK TABLES `Genres` WRITE;
/*!40000 ALTER TABLE `Genres` DISABLE KEYS */;
INSERT INTO `Genres` VALUES (1, 'Action'), (2, 'Adventure'), (3, 'RPG');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `GameGenres`
DROP TABLE IF EXISTS `GameGenres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GameGenres` (
  `game_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  PRIMARY KEY (`game_id`, `genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `gamegenres_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `Games` (`game_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gamegenres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `Genres` (`genre_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `GameGenres`
LOCK TABLES `GameGenres` WRITE;
/*!40000 ALTER TABLE `GameGenres` DISABLE KEYS */;
INSERT INTO `GameGenres` VALUES (1, 1), (1, 2), (2, 3);
/*!40000 ALTER TABLE `GameGenres` ENABLE KEYS */;
UNLOCK TABLES;

-- Developers table structure and data
DROP TABLE IF EXISTS `Developers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Developers` (
  `dev_ID` int(11) NOT NULL AUTO_INCREMENT,
  `dev_name` varchar(255) NOT NULL,
  PRIMARY KEY (`dev_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Developers` WRITE;
/*!40000 ALTER TABLE `Developers` DISABLE KEYS */;
INSERT INTO `Developers` VALUES (1, 'Dev1'), (2, 'Dev2');
/*!40000 ALTER TABLE `Developers` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
