const _ = require("lodash");

module.exports = {
  serializeMaterials(materials = [], menuMaterials = []) {
    return materials.map((material) => {
      const menuMaterial = menuMaterials.find(o => o.materialId.toString() === material._id.toString()) ?? {};
      return {
        id: material._id.toString(),
        ..._.pick(material, ["name", "price", "description", "unit", "quantity"]),
        ..._.pick(menuMaterial, ["quantity", "note"]),
      };
    });
  },
  serialize(materials = [], menuMaterials = []) {
    const materialSerialized = this.serializeMaterials(materials, menuMaterials);
    return {
      materials: materialSerialized
    }
  },
};
