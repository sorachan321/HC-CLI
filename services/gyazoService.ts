export const uploadToGyazo = async (file: File, accessToken: string): Promise<string> => {
  if (!accessToken) {
    throw new Error("Gyazo Access Token is missing");
  }

  const formData = new FormData();
  formData.append('imagedata', file);
  formData.append('access_token', accessToken);

  // Note: Gyazo API may have strict CORS policies depending on the environment.
  const response = await fetch(`https://upload.gyazo.com/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Gyazo upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Gyazo returns 'url' (direct image) and 'permalink_url' (viewer page).
  // We prefer 'url' for embedding in chat, but fallback to permalink if needed.
  return data.url || data.permalink_url;
};