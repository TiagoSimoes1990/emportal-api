class GeneralError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
      this.name = this.constructor.name; // Set the error name automatically
    }
  
    getCode() {
      return this.code;
    }
  }
  
  module.exports = {
    GeneralError
  };