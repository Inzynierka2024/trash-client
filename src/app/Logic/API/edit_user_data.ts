// editUserData.ts
import _fetch from './_fetch';

export async function edit_user_data(userData: any, token: string): Promise<boolean> {
  
  if (!token) {
    console.error("No token found");
    return false;
  }

  const URL = `/user/`; // Adjust if needed based on your API endpoint
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await _fetch(URL, "PUT", headers, userData);
    if (response.isOk) {
      return true;
    } else {
      console.error('Error updating user:', response);
      return false;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}
