export const uploadToImgBB = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY; // ✅ keep your API key in .env
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    return result.data.url; // ✅ image URL
  } else {
    throw new Error("Failed to upload image to ImgBB");
  }
};
