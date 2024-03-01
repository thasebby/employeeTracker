INSERT INTO department(name)
VALUES  ("Development Team"),
        ("Marketing"),
        ("Human Resources"),
        ("Finance");

INSERT INTO workRole(role_name,role_salary,department_id)
VALUES  ("Front-End Web Developer",105000,1),
        ("Product Manager",220000,1),
        ("Marketing Manager",118000,2),
        ("Graphic Designer",55000,2),
        ("Human Resource Manager",75000,3),
        ("HR Analytics Specialist",55000,3),
        ("Chief Financial Officer",300000,4),
        ("Internal Auditor",90000,4);   

-- REMEMBER TO ADD THE MANAGER ID WHEN YOU GET A CHANCE NULL IF THEY ARE MANAGER AND ASSIGNED TO THEIR MANAGER IF THEY AREN'T
INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES  ('John','Smith',1,0),
        ('Emily','Johnson',2,1),
        ('Michael','Brown',3,2),
        ('Jennifer','Davis',4,0),
        ('David','Wilson',5,3),
        ('Sophia','Taylor',6,0),
        ('Christopher','Martinez',7,4),
        ('Olivia','Anderson',8,0);


