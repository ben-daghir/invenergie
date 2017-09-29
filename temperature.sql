CREATE TABLE temperature (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  time        DATE NOT NULL,
  temperature DOUBLE PRECISION(8,4) NOT NULL,
  humidity    DOUBLE PRECISION(8,4) NOT NULL
);
