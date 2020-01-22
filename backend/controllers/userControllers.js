const {mysqldb}=require('../connection')
const {uploader}=require('../helper/uploader')
const fs=require('fs')


module.exports = {
    getUser: (req,res)=> {
        mysqldb.query(`select * from users`,(err,result)=>{
            if (err) res.status(500).send(err)
            res.status(200).send({datauser:result})
        })
    },
    
    postUser:(req,res)=>{
        try {
            const path = '/post/images'; //file save path
            const upload = uploader(path, 'USERS').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                // console.log('masuk')
                const { image } = req.files;
                console.log(req.files)
                const imagePath = image ? path + '/' + image[0].filename : null;
                // console.log(imagePath)
    
                // console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                // console.log(data)
                data.image = imagePath; // image dari database table (data.image itu nambah image ke data )
                // data.userId=req.user.userid
    
                var sql = 'INSERT INTO users SET ?';
                mysqldb.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath); // hapus foto kalau gagal 
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    mysqldb.query(`select * from users`,(err,result6)=>{
                        if (err) res.status(500).send(err)
                        res.status(200).send({datauser:result6})
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
       
    editUser: (req, res)=> {


        var userId= req.params.id;
        var sql = `select * from users where id=${userId}`
        mysqldb.query(sql, (err, result) =>{
            const path = '/post/images'; //file save path
            const upload = uploader(path, 'USERS').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                // console.log('masuk')
                const { image } = req.files;
                console.log(req.files)
                const imagePath = image ? path + '/' + image[0].filename : null;
                // console.log(imagePath)
    
                // console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                // console.log(data)
                
                
                try {
                    if(imagePath) {
                        data.image = imagePath;
                    } 
                    var sql = `update users set ? where id=${userId}`;
                    mysqldb.query(sql, data, (err, results) => {
                        if(err) {
                            if(imagePath) {
                                fs.unlinkSync('.public' + imagePath);
                            }
                            
                            return res.status(500).json({ message: "There's an error on the server. ", error: err.message });
                        }
                        if(imagePath){
                            if(result[0].image) {
                                fs.unlinkSync('./public' + result[0].image);

                            }
                        }
                        
                        mysqldb.query(`select * from users`,(err,result8)=>{
                            if (err) res.status(500).send(err)
                            res.status(200).send({datauser:result8})
                        })   
                    })

                }  catch(err) {
                    console.log(err.message)
                    return res.status(500).json({ message : "There's an erro on the server. please contact the administrator.", error:err.message});
                }



            })
        })

         
    },
    deleteUser: (req, res)=> {
        let sql=`select * from users where id=${req.params.id}`
        mysqldb.query(sql, (err,result)=>{
            if (err) res.status(500).send(err)
            if(result.length) {
                var sql = `delete from users where id=${req.params.id}`;
                mysqldb.query(sql, (err, results) => {
                    if (err) res.status(500).send(err)
                    if(result[0].image){
                        fs.unlinkSync('./public'+result[0].image)
                    }
                    mysqldb.query(`select * from users`,(err,result3)=>{
                        if (err) res.status(500).send(err)
                        res.status(200).send({datauser:result3})
                    })   
                }) 

            } else {
                
            }
        })

        
    }

}


