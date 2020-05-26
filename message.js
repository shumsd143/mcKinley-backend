const mongodb=require('mongodb')
const encrypting=require('./encrypting')
const mongoURI ='mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';

function postmessage(body,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('mckinley').collection('message_store').insertOne(body,(err,result)=>{
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
function getmessage(name,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            res.status(503)
            res.send({status:'failed',reason:'connection failed with db'})
            return
        }
        dbclient.db('mckinley').collection('message_store').find({$or:[{sent_by:name},{received_by:name}]}).toArray().then(data=>{
            if(err){
                res.status(503)
                res.send({status:'failed',reason:'error while fetching data in db'})
                return 
            }
            let decrypted_data=data.map(result=>{
                console.log(result.message)
                let body={
                    sent_by:result.sent_by,
                    received_by:result.received_by,
                }
                return body 
            })
            console.log(encrypting.decrypt(data[0].message))
            console.log(decrypted_data)
            res.send({status:'success',data:decrypted_data})
        })
    })
}

module.exports.postmessage=postmessage
module.exports.getmessage=getmessage