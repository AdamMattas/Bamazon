CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Departments(
  DepartmentID INTEGER (10) NOT NULL AUTO_INCREMENT,
  DepartmentName VARCHAR(50) NOT NULL,
  OverHeadCosts DECIMAL (10,2) NOT NULL,
  TotalSales DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (DepartmentID)
);

CREATE TABLE Products(
  ItemID INTEGER (10) NOT NULL AUTO_INCREMENT,
  ProductName VARCHAR(50) NOT NULL,
  DepartmentName VARCHAR(50) NOT NULL,
  Price DECIMAL (10,2) NOT NULL,
  StockQuantity INTEGER(50) NULL,
  PRIMARY KEY (ItemID)
);

-- INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("Minions Bandaids", "Health", 4.99, 26);

-- INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES ("Electronics", 2420.00, 0.00);
