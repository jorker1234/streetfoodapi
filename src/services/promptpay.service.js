const generatePromptPayData = require("promptpay-qr");
const { ErrorBadRequest } = require("../configs/errors");

const service = {
  getReceiveNumberFormat(receiveNumber) {
    if (!receiveNumber || isNaN(receiveNumber)) {
      throw ErrorBadRequest("receiveNumber is invalid");
    }
    if (receiveNumber.length === 10) {
      let receiveNumberArr = receiveNumber.split("");
      receiveNumberArr.splice(6, 0, "-");
      receiveNumberArr.splice(3, 0, "-");
      return receiveNumberArr.join("");
    }
    if (receiveNumber.length === 13) {
      let receiveNumberArr = receiveNumber.split("");
      receiveNumberArr.splice(12, 0, "-");
      receiveNumberArr.splice(10, 0, "-");
      receiveNumberArr.splice(5, 0, "-");
      receiveNumberArr.splice(1, 0, "-");
      return receiveNumberArr.join("");
    }
    throw ErrorBadRequest("receiveNumber is invalid");
  },

  async generatePayload(receiveNumber, amount) {
    const receiver = this.getReceiveNumberFormat(receiveNumber);
    return generatePromptPayData(receiver, { amount });
  },
};

module.exports = { ...service };
