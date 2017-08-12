-- ===========================
-- SCE CORE DATABASE version 2
-- ===========================
-- Created: 8/10/17
-- Author: Rolando Javier
-- For use with SCE Core v4; Creates an empty database

-- Create Database and connect
DROP DATABASE IF EXISTS `SCE-CORE2`;
CREATE DATABASE IF NOT EXISTS `SCE-CORE2` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `SCE-CORE2`;

-- Create RoleType table
DROP TABLE IF EXISTS `RoleType`;
CREATE TABLE `RoleType` (
	`ID` int(15) unsigned NOT NULL AUTO_INCREMENT,
    `Name` varchar(30) NOT NULL DEFAULT "undefined",
    PRIMARY KEY(`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dump defaults into RoleType
LOCK TABLES `RoleType` WRITE;
insert into `RoleType` (Name) values ("Member");	-- member must ALWAYS be rank 0
insert into `RoleType` (Name) values ("Associate");
insert into `RoleType` (Name) values ("Officer");
insert into `RoleType` (Name) values ("Admin");		-- admin must ALWAYS be highest rank
UNLOCK TABLES;

-- Create AbilityType table
DROP TABLE IF EXISTS `AbilityType`;
CREATE TABLE `AbilityType` (
	`ID` int(15) unsigned NOT NULL AUTO_INCREMENT,
    `Name` varchar(50) NOT NULL DEFAULT "undefined",
    PRIMARY KEY (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dump defaults into AbilityType
LOCK TABLES `AbilityType` WRITE;
insert into `AbilityType` (Name) values ("Add Members");
insert into `AbilityType` (Name) values ("Edit Members");
insert into `AbilityType` (Name) values ("Delete Members");
insert into `AbilityType` (Name) values ("Add Abilities");
insert into `AbilityType` (Name) values ("Edit Abilities");
insert into `AbilityType` (Name) values ("Delete Abilities");
insert into `AbilityType` (Name) values ("Grant Abilities");
insert into `AbilityType` (Name) values ("Add Announcements");
insert into `AbilityType` (Name) values ("Edit Announcements");
insert into `AbilityType` (Name) values ("Delete Announcements");
insert into `AbilityType` (Name) values ("Grant Admin Status");
insert into `AbilityType` (Name) values ("Revoke Admin Status");
insert into `AbilityType` (Name) values ("Add Reimbursements");
insert into `AbilityType` (Name) values ("Edit Reimbursements");
insert into `AbilityType` (Name) values ("Delete Reimbursements");
UNLOCK TABLES;

-- Create Member table
DROP TABLE IF EXISTS `Member`;
CREATE TABLE `Member` (
	`MemberID` int(15) unsigned NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(40) NOT NULL,
    `MiddleInitial` varchar(5),
    `LastName` varchar(40) NOT NULL,
    `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `Email` varchar(150) NOT NULL,
    `Password` varchar(255) NOT NULL,
    PRIMARY KEY(`MemberID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create MembershipData table
DROP TABLE IF EXISTS `MembershipData`;
CREATE TABLE `MembershipData` (
	`MemberID` int(15) unsigned NOT NULL,
    `StartTerm` datetime,
    `EndTerm` datetime,
    `AnnouncementOptOut` bit(8) DEFAULT 0,
    `DoorCode` varchar(10) DEFAULT NULL,
    `GradDate` datetime DEFAULT NULL,
    `Major` varchar(45) DEFAULT NULL,
    `RoleCode` int(15) unsigned NOT NULL DEFAULT 1,	-- defaults to rank 1 ("Member" role)
    `Status` varchar(30) NOT NULL DEFAULT "Inactive",
    PRIMARY KEY (`MemberID`),
    CONSTRAINT FOREIGN KEY (`MemberID`) REFERENCES `Member` (`MemberID`) ON DELETE NO ACTION ON UPDATE NO ACTION
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Create AbilitySet table
DROP TABLE IF EXISTS `AbilitySet`;
CREATE TABLE `AbilitySet` (
	`ID` int(15) unsigned NOT NULL AUTO_INCREMENT,
    `Abilities` varchar(60) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT FOREIGN KEY (`ID`) REFERENCES `RoleType` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ============
-- Test Queries
-- ============
insert into Member (FirstName, MiddleInitial, LastName, Timestamp, Email, Password) values ("Rolando", "L", "Javier", CURRENT_TIMESTAMP, "rjavier443@gmail.com", "somepassword");
insert into MembershipData (MemberID, StartTerm, EndTerm) values ((select MemberID from Member where FirstName="Rolando"), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
select * from RoleType;
select * from AbilityType;
select * from Member;
select * from MembershipData;
select * from AbilitySet;
-- show engine INNODB status;
-- select StartTerm from MembershipData where MemberID = (select MemberID from Member where FirstName = "Rolando");	-- finds MembershipData using Member.MemberID