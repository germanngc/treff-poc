export const getURLImage = (imageName, local) => {
  if (imageName) {
    if (local) {
      const url = process.env.PUBLIC_URL;
      return url + "/" + imageName;
    } else {
      if (imageName.startsWith("http")) return imageName;
      let baseUrl = process.env.REACT_APP_IMAGES_URL;
      const url = baseUrl;
      return url + imageName;
    }
  }
};
