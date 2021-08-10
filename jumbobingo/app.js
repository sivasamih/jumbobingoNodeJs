const express =require('express')
var cors = require('cors')
const app=express()
const port=3000

app.use(cors())

app.use(express.static('assets'))
 
app.use(express.static('/css',express.static(__dirname+'assets/css')))
app.use(express.static('/js',express.static(__dirname+'assets/js')))
app.use(express.static('/media',express.static(__dirname+'assets/media')))

app.set('views','./views') 
app.set('view engine','ejs')


app.get('',(req,res)=>{
    res.render('index')
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

app.get('/blankTicket',(req,res)=>{
    res.render('blank-tinket-design')
})

app.listen(port,()=>console.log('Listening port '))