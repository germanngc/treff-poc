export const getURLImage = (imageName, local) => {
  if (imageName) {
    if (local) {
      const url = process.env.PUBLIC_URL;
      return imageName;
    } else {
      if (imageName.startsWith("http")) return imageName;
      // let baseUrl = process.env.REACT_APP_IMAGES_URL;
      let baseUrl = "https://treffstorage.blob.core.windows.net/treff-files/";

      const url = baseUrl;
      return url + imageName + "?sp=r&st=2024-11-22T18:39:38Z&se=2034-11-23T02:39:38Z&spr=https&sv=2022-11-02&sr=c&sig=OJpo06ty%2FRen4SfY80OLfJH2ZYW%2FJffxrhE0ekiY6cU%3D";
    }
  }
};
