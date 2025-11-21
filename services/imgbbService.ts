export const uploadToImgBB = async (file: File, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.data.url;
};