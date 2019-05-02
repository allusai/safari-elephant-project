DROP DATABASE IF EXISTS elephants;
CREATE DATABASE elephants;

CREATE TABLE Rangers (
    rangerId INTEGER PRIMARY KEY AUTO_INCREMENT,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(500) NOT NULL
);

CREATE TABLE Cameras (
	deviceId INTEGER PRIMARY KEY AUTO_INCREMENT,
	deviceType varchar(255) NOT NULL,
	xLocation float(10) NOT NULL,
	yLocation float(10) NOT NULL,
	status varchar(255) NOT NULL,
	dataLinkType varchar(255) NOT NULL,
	dataLink varchar(2000) NOT NULL
);

CREATE TABLE Assignments (
	assignmentId INTEGER PRIMARY KEY AUTO_INCREMENT,
	rangerId int NOT NULL,
	deviceId int NOT NULL,
	FOREIGN KEY (rangerID) REFERENCES Rangers(rangerId),
	FOREIGN KEY (deviceID) REFERENCES Cameras(deviceId)
);


INSERT INTO Rangers(firstName, lastName, username, password)
VALUES (   'Coyote', 'Wild',  'howling15@gmail.com', 'ABC12345' );

INSERT INTO Rangers(firstName, lastName, username, password)
VALUES (    'Maggie', 'Shi',  'magpie12@usc.edu', 'DOMINOS_PIZZA' );


INSERT INTO Cameras(deviceType, xLocation, yLocation, status, dataLinkType, dataLink)
VALUES ( 'CCTV Camera', 103.4, 212.5,   'active', 'videoUrl', 'https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG');

INSERT INTO Cameras(deviceType, xLocation, yLocation, status, dataLinkType, dataLink)
VALUES ( 'Toshiba Aerial Drone', 98.3, 67.4,  'charging', 'videoUrl', 'https://www.youtube.com/embed/YK4E3nMR-KU');