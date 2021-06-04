const express = require("express");
const Food = require("../models/food.model")
const router = express.Router();
const auth = require("../auth-middleware")


// get all food
router.get("/food", async function (request, response, next) {

    try {
        let result = await Food.find()
        response.json(result);

    } catch (error) {
      return next(error)
    }

})

// get single food by ID
router.get("/food/:foodID", async function(request, response, next) {
    try {
        let result = await Food.findById(request.params.foodID)
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


// create new food
router.post("/food",auth, function (request, response, next) {

    try {
        let food = new Food({
            type: request.fields.type,
            name: request.fields.name,
            price: request.fields.price
        })
        food.save();

        response.status(201);
        response.json(food)

    } catch (error) {
        return next(error)

    }
    response.send("post request food")

})

router.patch("/food/:foodID",auth, async function (request, response, next) {
let {type, name, price} = request.fields
let updateObject = {}

if(type) updateObject.type = type;
if(name) updateObject.name = name;
if(price) updateObject.price = price;

let food = await Food.findByIdAndUpdate(request.params.foodID, updateObject, {new:true})

response.json(food);

})

router.delete("/food/:foodID",auth, async function (request, response, next) {

try {
    await Food.findByIdAndDelete(request.params.foodID)

    response.status(202)
    response.end()
} catch (error) {
    return next(error)
}

})

module.exports = router;