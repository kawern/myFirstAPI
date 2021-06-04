const express = require("express");
const router = express.Router();
const Animal = require("../models/animals.model")
const auth = require("../auth-middleware")


// get all animals - With limit and more exciting things
router.get("/animals", async function (request, response, next) {
    let limit = parseInt(request.query.limit) || 5;
    let offset = parseInt(request.query.offset) || 0;

    try {

        let count = (await Animal.find()).length;
        let result = await Animal.find().limit(limit).skip(offset)

        let queryStringNext = `?offset=${offset + limit}&limit=${limit}`;
        let queryStringPrev;

        if (offset >= limit) {
            queryStringPrev = `?offset=${offset - limit}&limit=${limit}`;
        }

        let apiURL = `${request.protocol}://${request.hostname}${request.hostname==="localhost" ? ":" + process.env.PORT : ''}`;
        let apiPATH = `${request.baseUrl}${request.path}`

        console.log(apiURL);

        let output = {
            count,
            next: (offset + limit < count) ? apiURL + apiPATH + queryStringNext : null,
            previous: offset > 0 ? apiURL + apiPATH + queryStringPrev : null,
            result,
            url: apiURL + request.originalUrl
        }
        response.json(output)

    } catch (error) {
        return next(error)
    }

})

// get single animal by ID
router.get("/animals/:animalID", async function (request, response, next) {
    try {
        let result = await Animal.findById(request.params.animalID)
        if (!result) {
            response.status(404)
            response.end()
            return;
        }
        response.status(202)
        response.json(result)
    } catch (error) {
        return next(error)
    }
})


// create new animal
router.post("/animals", auth, function (request, response, next) {

    try {
        let animal = new Animal({
            type: request.fields.type,
            breed: request.fields.breed,
            name: request.fields.name,
            age: request.fields.age,
            sex: request.fields.sex,
            colors: request.fields.colors
        })
        animal.save();

        response.status(201);
        response.json(animal)

    } catch (error) {
        return next(error)

    }
    response.send("post request animals")

})

// edit an animal
router.patch("/animals/:animalID", auth, async function (request, response, next) {
    let {
        type,
        breed,
        name,
        age,
        sex,
        colors
    } = request.fields
    let updateObject = {}

    if (type) updateObject.type = type;
    if (breed) updateObject.breed = breed;
    if (name) updateObject.name = name;
    if (age) updateObject.age = age;
    if (sex) updateObject.sex = sex;
    if (colors) updateObject.color = colors;

    let animal = await Animal.findByIdAndUpdate(request.params.animalID, updateObject, {
        new: true
    })

    response.json(animal);

})


// delete an animal
router.delete("/animals/:animalID", auth, async function (request, response, next) {

    try {
        await Animal.findByIdAndDelete(request.params.animalID)

        response.status(202)
        response.end()
    } catch (error) {
        return next(error)
    }

})

module.exports = router;