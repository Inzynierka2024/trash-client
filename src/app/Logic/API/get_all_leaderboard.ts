import { useContext } from "react";
import { UserModel } from "../../Models/UserMetadata";
import _fetch from "./_fetch";


export default async function get_all_leaderboard(token: string): Promise<any> {
    const URL = `/ranking/leaderboard`;  
    const headers = { Authorization: `Bearer ${token}` };
    const result = await _fetch(URL, "GET", headers);
    
    return result;
  }