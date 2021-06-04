// module/animals

const { Schema, model, SchemaTypes } = require("mongoose");

const AccSchema = new Schema({
animal: SchemaTypes.String,
category: SchemaTypes.String,
name: SchemaTypes.String,
price: SchemaTypes.Decimal128,
})

const Acc = model("Acc", AccSchema);

module.exports = Acc;