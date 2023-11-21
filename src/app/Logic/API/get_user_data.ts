import { useContext } from "react";
import { UserModel } from "../../Models/UserMetadata";
import _fetch from "./_fetch";


export default async function get_user_data(token: string): Promise<UserModel> {
    const URL = `/user/`;
  
    const headers = { Authorization: `Bearer ${token}` };
    const result = await _fetch(URL, "GET", headers);
  
    return {
      Username: result.data["username"],
      Email: result.data["email"],
      Location: {
        City: result.data["location"].city,
        Country: result.data["location"].country,
      },
    };
  }