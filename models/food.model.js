// module/animals

const { Schema, model, SchemaTypes } = require("mongoose");

const FoodSchema = new Schema({
type: SchemaTypes.String,
name: SchemaTypes.String,
price: SchemaTypes.Decimal128,
})

const Food = model("Food", FoodSchema);

module.exports = Food;