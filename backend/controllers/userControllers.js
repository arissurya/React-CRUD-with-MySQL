const {mysqldb}=require('../connection')

module.exports = {
    getUser: (req,res)=> {
        mysqldb.query(`select * from users`,(err,result)=>{
            if (err) res.status(500).send(err)
            res.status(200).send({datauser:result})
        })
    },
    postUser: (req, res)=> {
        var sql = 'INSERT INTO users SET ?';
       
        console.log(req.body)
        
        mysqldb.query(sql, req.body, (err, results) => {
            if(err) {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. ", error: err.message });
            }
            
            console.log(results);
            mysqldb.query(`select * from users`,(err,result4)=>{
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:result4})
            })   
        }) 
    },
    editUser: (req, res)=> {
        var sql = `update users set ? where id=${req.params.id}`;
        
        mysqldb.query(sql, req.body, (err, results) => {
            if(err) {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. ", error: err.message });
            }
            
            console.log(results);
            mysqldb.query(`select * from users`,(err,result3)=>{
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:result3})
            })   
        }) 
    },
    deleteUser: (req, res)=> {
        var sql = `delete from users where id=${req.params.id}`;
        
        mysqldb.query(sql, (err, results) => {
            if(err) {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. ", error: err.message });
            }
            
            console.log(results);
            mysqldb.query(`select * from users`,(err,result3)=>{
                if (err) res.status(500).send(err)
                res.status(200).send({datauser:result3})
            })   
        }) 
    }

}


