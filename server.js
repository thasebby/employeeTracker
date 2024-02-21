const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Server running on ${ PORT }`)
});

const db = mysql.createConnection(
    {
        host:"localhost",
        user: 'root',
        password:'sqlpass',
        database:'ETracker_db'
    },
);