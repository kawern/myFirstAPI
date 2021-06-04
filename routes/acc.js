const express = require("express");
const Acc = require("../models/acc.model")
const router = express.Router();
const auth = require("../auth-middleware")


// get all accessories
router.get("/accessories", async function (request, response, next) {

    try {
        let result = await Acc.find()
        response.json(result);

    } catch (error) {
      return next(error)
    }

})

// get single accessories by ID
router.get("/accessories/:accID", async function(request, response, next) {
    try {
        let result = await Acc.findById(request.params.accID)
        if(!result) {
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


// create new accessories
router.post("/accessories",auth, function (request, response, next) {

    try {
        let acc = new Acc({
            animal: request.fields.animal,
            category: request.fields.category,
            name: request.fields.name,
            price: request.fields.price
        })
        acc.save();

        response.status(201);
        response.json(acc)

    } catch (error) {
        return next(error)

    }
    response.send("post request accessories")

})

router.patch("/accessories/:accID",auth, async function (request, response, next) {
let {animal, category, name, price} = request.fields
let updateObject = {}

if(animal) updateObject.animal = animal;
if(category) updateObject.category = category;
if(name) updateObject.name = name;
if(price) updateObject.price = price;

let acc = await Acc.findByIdAndUpdate(request.params.accID, updateObject, {new:true})

response.json(acc);

})

router.delete("/accessories/:accID",auth, async function (request, response, next) {

try {
    await Acc.findByIdAndDelete(request.params.accID)

    response.status(202)
    response.end()
} catch (error) {
    return next(error)
}

})

module.exports = router;