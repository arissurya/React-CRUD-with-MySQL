const mysql=require('mysql')

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'projectbaru',
    port:'3306'
})

module.exports=db