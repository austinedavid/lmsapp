export const useCloudinary = () => {
  const imageUpload = async (image: Blob): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_cloudinary_preset}`
    );
    try {
      const result = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_cloudinaryName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseBody = await result.json();
      const imgUrl = responseBody.secure_url;
      return imgUrl;
    } catch (error) {}
  };

  const videoUpload = async (video: Blob): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", video);
    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_cloudinary_preset}`
    );
    try {
      const result = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_cloudinaryName}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseBody = await result.json();
      const videoUrl = responseBody.secure_url;
      return videoUrl;
    } catch (error) {}
  };

  return { imageUpload, videoUpload }; // Return both functions
};
