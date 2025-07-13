const express= require('express')
const sqlite3=require('sqlite3').verbose()
const cors=require('cors')
const { json } = require('body-parser')

const app=express()
const PORT=300

app.use(cors())
app.use(express.json())

const db= new sqlite3.Database('./headings.db',(err)=>{
    if(err){
         console.error('Error opening database', err);
    }else{
        console.log('connected to sql database succesfully')
    }
})

db.run(`CREATE TABLE IF NOT EXISTS headings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL
)`);

//saving heading in db 

app.post('/api/heading', (req, res)=>{
    const {text}=req.body

    db.run(`INSERT INTO headings (text) VALUES (?)`,[text],(err)=>{
        if(err){
            console.error(err)
        }
        console.log('heading added to db')
    })
})

//geting heading from db

app.get('/api/heading', (req, res) => {
    db.get(`SELECT text FROM headings ORDER BY id DECS LIMIT 1`,(err,row)=>{

        if(err){
            console.error(err)
        }
        if(!row){
            return res.status(400).json({message:'Not Found'})
        }
        res.json({heading:row.text})
    })
})

//running the server 

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})