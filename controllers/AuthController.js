const cryptogenerate=require('./../helper/encrypt')
const {mysqldb}=require('./../connection')

module.exports={
    belajarcrypto:(req,res)=>{
        console.log(req.query)

        const hashpassword=cryptogenerate(req.query.password)
        // const hashpassword1=crypto.createHmac('sha256','jc11').update(req.query.password).digest('hex')
        // 83aa90211d9d2bb7b133a4772e9a5129f98209847f58b3fca72d8bb33307b74d puripuri
        // 83aa90211d9d2bb7b133a4772e9a5129f98209847f58b3fca72d8bb33307b74d puripuri
        // 8b7de4fbd7e7bf201eada074276ba8a6964a9b963ad0c194ed50920833ee8a53 jc11
        res.send({encryptan:hashpassword,panjangencrypt:hashpassword.length})
    },
    register:(req,res)=>{
        var data=req.body
        
        data.password=cryptogenerate(data.password)
        var sql = 'INSERT INTO users SET ?';
        mysqldb.query(sql,data, (err, results) => {
            if(err) {
                console.log(err.message)
                // fs.unlinkSync('./public' + imagePath);
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
           
            console.log(results);
            mysqldb.query(`select u.*,r.nama as rolename from users u left join roles r on u.roleid=r.id order by u.id`,(err,result4)=>{
                if (err) res.status(500).send(err)
                mysqldb.query('select * from roles',(err,result5)=>{
                    if (err) res.status(500).send(err)
                    res.status(200).send({datauser:result4,datarole:result5})
                })
            })   
        })    
    },
    login:(req,res)=>{
        var hashpassword=cryptogenerate(req.query.password)
        var sql=`select * from users where username='${req.query.username}' and password='${hashpassword}'`
        mysqldb.query(sql,(err,result)=>{
            if (err) res.status(500).send(err)
            res.send({message:'berhasil login',data:result})
        })
    }
}