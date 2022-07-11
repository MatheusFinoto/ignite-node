const { request, response } = require('express');
const express = require('express');

const app = express();

/**
 * GET - BUSCAR UMA INFORMAÇÃO DENTRO DO SERVIDOR
 * POST - INSERIR UMA INFO NO SERVIDOR
 * PUT - ALTERAR UMA INFO NO SERVIDOR
 * PATH ALTERAR UMA INFO ESPECIFICA
 * DELETE - DELETEAR UMA INFO NO SERVIDOR
 */

/**
 * Tipod de parametros
 * 
 * Routes params => identificar um recurso editar/deletar/buscar
 * Query params => paginação / filtro 
 * Body params => os objetos para inserção / alteração
 */

app.use(express.json());

app.get("/courses", (request, response)=> {
    const query = request.query;
    console.log(query);
    return response.json(["Curso 1", "Curso 2", "Curso 3"])
})

app.post("/courses", (request, response)=> {
    const body = request.body;
    console.log(body);
    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"])
})

app.put("/courses/:id", (request, response)=> {
    const params = request.params
    console.log(params);
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})

app.path("/courses/:id", (request, response)=> {
    return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"])
})

app.delete("/courses/:id", (request, response)=> {
    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"])
})



app.listen(3333);