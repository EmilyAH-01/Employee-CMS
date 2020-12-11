USE employeeDB;

INSERT INTO department (name)
VALUES ("HR"), ("Accounting"), ("Engineering"), ("Facilities");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Personnel", 50000, 1), ("Accountant", 70000, 2), 
    ("Engineer", 60000, 3), ("Senior Engineer", 80000, 3), 
    ("Lead Engineer", 100000, 3), ("Facilities Engineer", 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Emily", "Herman", 4, null), ("Ben", "Limberg", 5, null), ("Deanna", "Brandell", 5, null),
    ("Mike", "Berggren", 5, null), ("Eric", "Barbe", 6, null), ("Carrie", "Rustad", 1, 10),
    ("Gina", "Billings", 2, null), ("Wen", "Walsh", 3, null), ("Kaylee", "Dowbenko", 2, 7),
    ("Chris", "Allen", 1, null);

