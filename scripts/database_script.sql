CREATE TABLE articles (
    id INT, 
    title VARCHAR(100),
    author VARCHAR(100), 
    body VARCHAR(100)
);
ALTER TABLE articles CHANGE id id INT AUTO_INCREMENT PRIMARY KEY;

/*
INSERT INTO articles VALUES ('Title 1', 'Author 1', 'Body 1');
INSERT INTO articles VALUES ('Title 2', 'Author 2', 'Body 2');
INSERT INTO articles VALUES ('Title 3', 'Author 3', 'Body 3');
INSERT INTO articles VALUES ('Title 4', 'Author 4', 'Body 4');
INSERT INTO articles VALUES ('Title 5', 'Author 5', 'Body 5');
COMMIT;
*/

CREATE TABLE users (
    id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    username VARCHAR(100), 
    password VARCHAR(100)
);
ALTER TABLE users CHANGE id id INT AUTO_INCREMENT PRIMARY KEY;