import { useContext } from "react";
import { UserModel } from "../../Models/UserMetadata";
import _fetch from "./_fetch";


export default async function get_user_garbage(token: string): Promise<any> {
    const URL = `/user/garbage`;  
    const headers = { Authorization: `Bearer ${token}` };
    const result = await _fetch(URL, "GET", headers);
    
    return result;
  }