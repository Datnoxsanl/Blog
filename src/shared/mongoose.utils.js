export const mongooseToObject = (mongooseDoc) => {
  return mongooseDoc ? mongooseDoc.toObject() : mongooseDoc;
};

export const mongooseArrayToObject = (mongooseArray) => {
  return Array.isArray(mongooseArray)
    ? mongooseArray.map((doc) => mongooseToObject(doc))
    : mongooseArray;
};
