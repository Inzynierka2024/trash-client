import { useContext } from "react";
import { UserModel } from "../../Models/UserMetadata";
import _fetch from "./_fetch";


export default async function get_user_bins(token: string): Promise<any> {
    const URL = `/user/bin`;  
    const headers = { Authorization: `Bearer ${token}` };
    const result = await _fetch(URL, "GET", headers);
    return result;
  }