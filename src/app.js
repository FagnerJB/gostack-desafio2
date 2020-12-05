const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateID(request, response, next) {

   const { id } = request.params

   if (!isUuid(id))
      return response.status(400).send('invalid')

   const repoIndex = repositories.findIndex(repo => repo.id === id)

   if (repoIndex < 0)
      return response.status(400).json({ error: 'Not found' })

   request.repoIndex = repoIndex

   next()

}

app.get("/repositories", (request, response) => {
   return response.json(repositories)
});

app.post("/repositories", (request, response) => {
   const { title, url, techs } = request.body

   const newRepo = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
   }
   repositories.push(newRepo)

   return response.json(newRepo)
})

app.put("/repositories/:id", validateID, (request, response) => {

   const { title, url, techs } = request.body

   if (title)
      repositories[request.repoIndex] = { ...repositories[request.repoIndex], title }

   if (url)
      repositories[request.repoIndex] = { ...repositories[request.repoIndex], url }

   if (techs)
      repositories[request.repoIndex] = { ...repositories[request.repoIndex], techs }

   return response.json(repositories[request.repoIndex])

})

app.delete("/repositories/:id", validateID, (request, response) => {

   repositories.splice(request.repoIndex, 1)

   return response.status(204).send()
});

app.post("/repositories/:id/like", validateID, (request, response) => {

   const currentLikes = repositories[request.repoIndex].likes

   repositories[request.repoIndex] = { ...repositories[request.repoIndex], likes: currentLikes + 1 }

   return response.json(repositories[request.repoIndex])

});

module.exports = app;
