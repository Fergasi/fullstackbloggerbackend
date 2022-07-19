const serverCheckBlogIsValid = (reqBody) => {
  if (
    !reqBody.hasOwnProperty("title") ||
    !typeof reqBody.title === "string" ||
    reqBody.title < 1
  ) {
    return false;
  }

  if (
    !reqBody.hasOwnProperty("text") ||
    !typeof reqBody.text === "string" ||
    reqBody.text < 1
  ) {
    return false;
  }

  if (
    !reqBody.hasOwnProperty("author") ||
    !typeof reqBody.author === "string" ||
    reqBody.author < 1
  ) {
    return false;
  }

  if (
    !reqBody.hasOwnProperty("category") ||
    !typeof reqBody.category === "string" ||
    reqBody.category < 1
  ) {
    return false;
  }

  return true;
};

module.exports = {
  serverCheckBlogIsValid,
};
