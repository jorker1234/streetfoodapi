const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const firebaseStorage = require("../models/Firebase");

const service = {
  async upload(file, folder) {
    try {
      const timestamp = Date.now();
      const [name, type] = file.originalname.split(".");
      const fileName = `${folder}/${name}_${timestamp}.${type}`;
      const metadata = {
        contentType: file.mimetype,
      };

      const storageRef = ref(firebaseStorage, fileName);
      const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return {
        imagePath: fileName,
        imageUrl: downloadUrl,
      };
    } catch (error) {
      throw error;
    }
  },

  async remove(imagePath) {
    try {
      const storageRef = ref(firebaseStorage, imagePath);
      return await deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { ...service };
