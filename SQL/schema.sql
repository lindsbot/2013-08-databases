CREATE DATABASE chat;

USE chat;

CREATE TABLE chatRooms(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255),
 PRIMARY KEY(id)
);

CREATE TABLE users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255),
 age INT,
 sex VARCHAR(255),
 email VARCHAR(255),
 location VARCHAR(255),
 PRIMARY KEY(id)
);

CREATE TABLE messages(
 id INT NOT NULL AUTO_INCREMENT,
 id_user INT,
 createdAt DATE,
 body VARCHAR(255),
 id_chatroom INT,
 PRIMARY KEY(id),
 FOREIGN KEY(id_user) REFERENCES users(id),
 FOREIGN KEY(id_chatroom) REFERENCES chatRooms(id)
);