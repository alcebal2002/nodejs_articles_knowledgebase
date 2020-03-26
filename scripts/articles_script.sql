CREATE TABLE articles (
    id INT, 
    title VARCHAR(100),
    author VARCHAR(100), 
    body VARCHAR(100)
);
ALTER TABLE articles ADD PRIMARY KEY (id);

INSERT INTO articles VALUES (1,'Title 1', 'Author 1', 'Body 1');
INSERT INTO articles VALUES (2,'Title 2', 'Author 2', 'Body 2');
INSERT INTO articles VALUES (3,'Title 3', 'Author 3', 'Body 3');
INSERT INTO articles VALUES (4,'Title 4', 'Author 4', 'Body 4');
INSERT INTO articles VALUES (5,'Title 5', 'Author 5', 'Body 5');
COMMIT;