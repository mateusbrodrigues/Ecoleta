const express = require("express")
const server = express()

// importar o db
const db = require("./database/db.js")

// configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body 
server.use(express.urlencoded({extended: true}))

//template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//página inicial
server.get("/", (req,res) => {
    return res.render("index.html", {
        title: "Seu marketplace de coleta de resíduos."
    })
})


//página cadastro coleta
server.get("/create-point", (req,res) => {
    //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req,res) => {
    //console.log(req.body)
    //inserindo dados no db
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        )
        VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso!")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query,values, afterInsertData)

})

//página resultado busca
server.get("/search", (req,res) => {

    const search = req.query.search
    if(search == ""){
        // pesquisa vazia
        return res.render("search-results.html",{total: 0})
    }

    //pegar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err,rows){
        if(err){
            return console.log(err)
        }
        const total = rows.length
        return res.render("search-results.html",{places: rows,total})
    })

   
})





server.listen(3000)