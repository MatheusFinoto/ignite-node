const express = require("express")
const {v4: uuidv4} = require("uuid")

const app = express()

app.use(express.json())
 
const customers = []

//MIDDLEWARE
function verifyIfExistsAccoundCPF(request, response, next){
    const {cpf} = request.headers

    const customer = customers.find((customer)=> customer.cpf === cpf)

    if(!customer){
        return response.status(400).json({error:"customer not found"})
    }

    request.customer = customer

    return next()
}

function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if(operation.type === "credit"){
            return acc + operation.amount
        }else{
            return acc - operation.amount
        }
    }, 0)

    return balance
}


/**
 * cpf string
 * name string
 * id uuid
 * statement []
 */

app.post("/account", (request, response)=>{
    const {cpf, name} = request.body

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExists){
        return response.status(400).send({error: "Customers already exists!"})
    }

    customers.push({cpf, name, id: uuidv4(), statement: []})

    return response.status(201).send()
})

// app.use(verifyIfExistsAccoundCPF)

app.get("/statement", verifyIfExistsAccoundCPF, (request, response)=>{
    const {customer} = request
    return response.json(customer.statement)
})

app.post("/deposit",verifyIfExistsAccoundCPF, (request, response)=>{
    const {description, amount} = request.body

    const {customer} = request

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.post("/withdraw", verifyIfExistsAccoundCPF, (request, response)=>{
    const {amount} = request.body
    const {customer} = request

    const balance = getBalance(customer.statement)
    
    if(balance < amount){
        return response.status(400).json({error:"insuficient founds!"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }
    
    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.get("/statement/date", verifyIfExistsAccoundCPF, (request, response)=>{
    const {customer} = request
    const {date} = request.query

    const dateFormat = new Date(date + " 00:00")
 
    const statement = customer.statement.filter((statement)=>statement.created_at.toDateString() === 
    new Date(dateFormat).toDateString())


    return response.json(statement)
})

app.put("/account", verifyIfExistsAccoundCPF,( request, response)=>{
    const {name} = request.body
    const {customer} = request
    
     customer.name = name;

    return response.status(201).send()
})

app.get("/account", verifyIfExistsAccoundCPF,(request, response)=>{
    const {customer} = request

    return response.json(customer)
})

app.delete("/account", verifyIfExistsAccoundCPF, (request, response)=>{
    const customer = request

    customers.splice(customer.body, 2)

    return response.status(200).json(customers)
})

app.listen(3333) 