-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 02, 2017 at 10:20 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cs4400_Group_46`
--

-- --------------------------------------------------------

--
-- Table structure for table `BREEZE_CARD`
--

DROP TABLE IF EXISTS `BREEZE_CARD`;
CREATE TABLE IF NOT EXISTS `BREEZE_CARD` (
  `Number` char(16) NOT NULL,
  `Value` decimal(6,2) NOT NULL,
  `Username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Number`),
  KEY `Username` (`Username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `BREEZE_CARD`
--

INSERT INTO `BREEZE_CARD` (`Number`, `Value`, `Username`) VALUES
('0919948381768459', 126.50, 'commuter14'),
('1788613719481390', 127.00, 'busrider73'),
('2792083965359460', 20.00, 'sandrapatel'),
('0524807425551662', 59.50, 'ignacio.john'),
('7792685035977770', 80.25, 'riyoy1996'),
('1325138309325420', 97.00, 'kellis'),
('6411414737900960', 41.00, 'ashton.woods'),
('9248324548250130', 12.75, 'sandrapatel'),
('8753075721740010', 110.00, 'sandrapatel'),
('7301442590825470', 6.00, 'sandrapatel'),
('4769432303280540', 68.50, 'sandrapatel'),
('4902965887533820', 79.75, 'sandrapatel'),
('0475861680208144', 35.25, 'commuter14'),
('5943709678229760', 133.50, 'commuter14'),
('2613198031233340', 45.00, 'commuter14'),
('2286669536044610', 0.50, 'commuter14'),
('6424673176102560', 27.00, 'commuter14'),
('4792323707679860', 34.00, 'commuter14'),
('2006517782865770', 127.25, 'commuter14'),
('3590098235166490', 16.25, 'commuter14'),
('2275718423410130', 143.25, 'commuter14'),
('8802558078528210', 42.25, 'busrider73'),
('9712526903816770', 68.50, 'busrider73'),
('6603808416168570', 41.50, 'busrider73'),
('9286930794479390', 116.25, 'kellis'),
('0123456780987654', 140.25, NULL),
('9876543212345670', 92.50, NULL),
('7534785562588930', 85.50, 'adinozzo'),
('3346822267258650', 113.00, NULL),
('1258825691462690', 144.75, NULL),
('4156771407939460', 110.50, NULL),
('1156635952683150', 141.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `BUS_STATION`
--

DROP TABLE IF EXISTS `BUS_STATION`;
CREATE TABLE IF NOT EXISTS `BUS_STATION` (
  `StopID` varchar(45) NOT NULL,
  `Intersection` varchar(45) NOT NULL,
  PRIMARY KEY (`StopID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `BUS_STATION`
--

INSERT INTO `BUS_STATION` (`StopID`, `Intersection`) VALUES
('BUSN11', 'Peachtree-Dunwoody Road'),
('BUSDOME', ''),
('BUSN4', '10th Street'),
('BUSS2', ''),
('35161', 'Park Bridge Pkwy'),
('31955', 'North Point Pkwy'),
('95834', 'Haynes Bridge Pkwy'),
('46612', 'Commerce Pkwy');

-- --------------------------------------------------------

--
-- Table structure for table `CONFLICT`
--

DROP TABLE IF EXISTS `CONFLICT`;
CREATE TABLE IF NOT EXISTS `CONFLICT` (
  `DateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Username` varchar(45) NOT NULL,
  `Number` char(16) NOT NULL,
  PRIMARY KEY (`Username`,`Number`),
  KEY `Number` (`Number`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `CONFLICT`
--

INSERT INTO `CONFLICT` (`DateTime`, `Username`, `Number`) VALUES
('2018-11-12 00:00:01', 'sandrapatel', '0475861680208144'),
('2017-10-23 16:21:49', 'kellis', '4769432303280540'),
('2017-10-24 07:31:12', 'riyoy1996', '4769432303280540');

-- --------------------------------------------------------

--
-- Table structure for table `PASSENGER`
--

DROP TABLE IF EXISTS `PASSENGER`;
CREATE TABLE IF NOT EXISTS `PASSENGER` (
  `Username` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  PRIMARY KEY (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PASSENGER`
--

INSERT INTO `PASSENGER` (`Username`, `Email`) VALUES
('commuter14', 'LeonBarnes@superrito.com'),
('busrider73', 'lena.wexler@dayrep.com'),
('sandrapatel', 'sandra74@jourrapide.com'),
('ignacio.john', 'john@iconsulting.com'),
('riyoy1996', 'yamada.riyo@navy.mil.gov'),
('kellis', 'kateellis@gatech.edu'),
('ashton.woods', 'awoods30@gatech.edu'),
('adinozzo', 'anthony.dinozzo@ncis.mil.gov');

-- --------------------------------------------------------

--
-- Table structure for table `STATION`
--

DROP TABLE IF EXISTS `STATION`;
CREATE TABLE IF NOT EXISTS `STATION` (
  `StopID` varchar(45) NOT NULL,
  `EnterFare` decimal(4,2) NOT NULL,
  `ClosedStatus` tinyint(1) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `IsTrainStation` tinyint(1) NOT NULL,
  PRIMARY KEY (`StopID`),
  UNIQUE KEY `Name` (`Name`,`IsTrainStation`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `STATION`
--

INSERT INTO `STATION` (`StopID`, `EnterFare`, `ClosedStatus`, `Name`, `IsTrainStation`) VALUES
('31955', 2.00, 0, 'Old Milton Pkwy - North Point Pkwy', 0),
('35161', 2.00, 1, 'Old Milton Pkwy - Park Bridge Pkwy', 0),
('46612', 2.00, 0, 'Alpharetta Hwy - Commerce Pkwy', 0),
('95834', 2.00, 0, 'Old Milton Pkwy - Haynes Bridge Pkwy', 0),
('BUSDOME', 4.00, 0, 'Georgia Dome Bus Station', 0),
('BUSN11', 2.00, 0, 'North Springs', 0),
('BUSN4', 5.00, 0, 'Midtown', 0),
('BUSS2', 2.50, 0, 'West End', 0),
('E1', 2.50, 0, 'Georgia State', 1),
('E2', 2.50, 0, 'King Memorial', 1),
('E3', 2.50, 0, 'Inman Park/Reynolds Town', 1),
('E4', 2.50, 0, 'Edgewood/Candler Park', 1),
('E5', 3.00, 0, 'East Lake', 1),
('E6', 2.50, 0, 'Decatur', 1),
('E7', 2.50, 0, 'Avondale', 1),
('E8', 3.00, 0, 'Kensington', 1),
('E9', 2.50, 0, 'Indian Creek', 1),
('FP', 8.00, 0, 'Five Points', 1),
('N1', 6.00, 0, 'Peachtree Center', 1),
('N10', 2.00, 0, 'Sandy Springs', 1),
('N11', 2.50, 0, 'North Springs', 1),
('N2', 4.00, 0, 'Civic Center', 1),
('N3', 3.00, 0, 'North Avenue', 1),
('N4', 5.00, 0, 'Midtown', 1),
('N5', 4.00, 0, 'Arts Center', 1),
('N6', 2.00, 0, 'Lindbergh Center', 1),
('N7', 1.00, 0, 'Buckhead', 1),
('N8', 4.00, 0, 'Medical Center', 1),
('N9', 3.00, 0, 'Dunwoody', 1),
('P4', 1.00, 1, 'Bankhead', 1),
('S1', 10.00, 0, 'Garnett', 1),
('S2', 25.00, 0, 'West End', 1),
('S3', 5.00, 0, 'Oakland City', 1),
('S4', 2.50, 1, 'Lakewood/Ft. McPherson', 1),
('S5', 2.50, 0, 'East Point', 1),
('S6', 2.50, 0, 'College Park', 1),
('S7', 2.50, 0, 'Atlanta Airport', 1),
('W1', 2.50, 0, 'GA Dome, GA World Congress Center, Phillips A', 1),
('W2', 2.50, 0, 'Vine City', 1),
('W3', 2.50, 0, 'Ashby', 1),
('W4', 2.50, 0, 'West Lake', 1),
('W5', 2.50, 1, 'Hamilton E. Holmes', 1);

-- --------------------------------------------------------

--
-- Table structure for table `TRIP`
--

DROP TABLE IF EXISTS `TRIP`;
CREATE TABLE IF NOT EXISTS `TRIP` (
  `CurrentFare` decimal(4,2) NOT NULL,
  `StartTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `StartsStopID` varchar(45) NOT NULL,
  `Number` char(16) NOT NULL,
  `EndsStopID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`StartTime`,`Number`),
  KEY `Number` (`Number`),
  KEY `StartsStopID` (`StartsStopID`),
  KEY `EndsStopID` (`EndsStopID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `TRIP`
--

INSERT INTO `TRIP` (`CurrentFare`, `StartTime`, `StartsStopID`, `Number`, `EndsStopID`) VALUES
(2.75, '2017-11-05 16:21:49', 'N11', '0524807425551662', 'N4'),
(1.50, '2017-11-03 09:44:11', 'N4', '0524 8074 2555 1', 'N11'),
(10.50, '2017-11-02 13:11:11', 'BUSDOME', '1788613719481390', 'BUSN11'),
(4.00, '2017-11-02 13:11:11', '31955', '2792083965359460', '46612'),
(2.00, '2017-10-31 22:33:10', 'S7', '0524807425551662', 'N4'),
(3.50, '2017-10-31 22:31:10', 'E1', '7792685035977770', 'N3'),
(1.00, '2017-10-31 21:30:00', 'FP', '1325138309325420', ''),
(3.50, '2017-10-28 22:30:10', 'N11', '6411414737900960', 'N4'),
(1.50, '2017-10-28 22:11:13', 'N4', '9248324548250130', 'N11'),
(1.00, '2017-10-27 09:40:11', 'N3', '8753075721740010', 'N4'),
(9.00, '2017-10-27 04:31:30', 'N4', '7301442590825470', 'S7'),
(1.50, '2017-10-10 00:00:00', 'BUSS2', '7534785562588930', 'BUSDOME');

-- --------------------------------------------------------

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
CREATE TABLE IF NOT EXISTS `USER` (
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER`
--

INSERT INTO `USER` (`Username`, `Password`, `isAdmin`) VALUES
('admin', '0192023a7bbd73250516f069df18b500', 1),
('kparker', '09e5af83d93166c76b351d52a8fe69b5', 1),
('eoneil', '6b11eaa6bbd19c856b59688fae281d56', 1),
('commuter14', '439c7fd92969510d873330e327c0f64d', 0),
('busrider73', '0e63f5aa002eca0b0e293ee6b733c50a', 0),
('sandrapatel', '63c9e8af485ed2e845d29c2874e584ea', 0),
('ignacio.john', '6f5de409600e6ac40b8e7698bbd004f6', 0),
('riyoy1996', '7039e7594e4f4fd6789e9810150e64b9', 0),
('kellis', '370133f7117dc65e277d6dbb858450c1', 0),
('ashton.woods', '27465020c9ea11fc41fac2af1daeba5f', 0),
('adinozzo', 'c67e443eaa780debf5ee2d71a2a7dc39', 0);
