const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))

let movies = [{
    id: '1',
    title:'inception',
    release_date:'2010-07-16'

},{
    id: '2',
    title:'The Wall',
    release_date:'2011-08-19'

}]

app.get('/movie',(req,res) =>{
    res.json(movies)
})

app.post('/movie',(req,res) =>{
    const movie = req.body
    console.log(movie)
    movies.push(movie)
    res.send("Movie added in the list");
})

app.listen(process.env.PORT || port,()=> console.log(`Server listening on port ${port}`));