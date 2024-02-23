SELECT workRole.role_name,workRole.id,department.name,workRole.role_salary
FROM workRole
JOIN department
ON workRole.department_id = department.id;