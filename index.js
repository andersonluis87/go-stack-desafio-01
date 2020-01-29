const express = require('express');

const server = express();

server.use(express.json());


function countRequests (request, response, next) { 
    console.count(`Requisições`);

   return next();
}

server.use(countRequests);


function checkIfProjectIdExists(request, response, next) {
    const { id } = request.params;
    const project = getProjectById(id);

    if (!project) {
        return response.status(404).json("Project not found");
    }
    
    return next(); 
}


const projects = [
    { 
        id: "1",
        title: "Fazer desafio 01",
        tasks: [
            "Criar rota para GetAll"
        ]
    }
]

function getProjectById(id) { 
    return projects.find(project => project.id == id)
}


server.get('/projects', (request, response) => {
    return response.json(projects);
});


server.get('/projects/:id', (request, response) => {
    const { id } = request.params;

    return response.json(getProjectById(id));
});


server.post('/projects', (request, response) => {
    const { id, title } = request.body;
    
    projects.push({ id, title, tasks: []});

    return response.json(projects);
});


server.put('/projects/:id', checkIfProjectIdExists, (request, response) => {
    const { id } = request.params;
    const { title } = request.body;

    const project = getProjectById(id)
    project.title = title;

    return response.json(project);
});


server.delete('/projects/:id', checkIfProjectIdExists, (request, response) => {
    const { id } = request.params;

    const index = projects.findIndex(project => project.id == id);

    projects.splice(index, 1)

    return response.send();
});


server.post('/projects/:id/tasks', checkIfProjectIdExists, (request, response) => {
    const { id } = request.params;
    const { title } = request.body;
    
    const project = getProjectById(id);

    project.tasks.push(title);

    return response.json(project); 
});


server.listen(3000);
