const _ = require("lodash");

module.exports = {
  serializeMaterials(materials = []) {
    return materials.map((material) => {
      return {
        id: material._id.toString(),
        ..._.pick(material, ["name", "price", "description", "unit"]),
      };
    });
  },
  serialize(materials = []) {
    const materialSerialized = this.serializeMaterials(materials);
    return {
      materials: materialSerialized
    }
  },
};
