const mongodb=require('mongodb')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const bcrypt=require('bcrypt')

function postingdata(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('mckinley').collection('login').insertOne(body,(err,result)=>{
            if(err){
                console.log('error while posting data')
                res.status(503)
                res.send({status:'failed',reason:'error while inserting data in db'})
                return 
            }
            res.send({status:'success',data:result})
        })
    })
}
function loginuser(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('mckinley').collection('login').findOne({'phone':body.phone},(err,result)=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'connection failed with db'})
                return
            }
            if(!result){
                res.statusMessage='Phone is not registered'
                res.status(400)
                res.send({status:'failed'})
            }
            else{
                if(bcrypt.compareSync(body.password,result.password)){
                    res.status(200)
                    res.send({status:'success',data:result})
                }
                else{
                    res.status(400)
                    res.send({status:'failed',reason:'wrong password'})
                }
            }
        })
    })
}

module.exports.postingdata=postingdata
module.exports.loginuser=loginuser