// employees-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const modelName = "employees";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const dependent = new Schema({
    name: { type: String, required: true },
    department: { type: "ObjectId", required: true }
  });

  const schema = new Schema(
    {
      name: { type: String, required: true },
      dependent: [{ type: dependent }],
      department: { type: "ObjectId", required: true }
    },
    {
      timestamps: true
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
