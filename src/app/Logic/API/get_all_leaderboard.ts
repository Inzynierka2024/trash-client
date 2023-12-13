import _fetch from "./_fetch";

export default async function () {
    const URL = `/leaderboard`;
    //console.log("Fetching:", URL);
    
    const response = await _fetch(URL, "GET", {});
  
    //console.log("get_all_scoreboard: ",response);
    return response;
  }
  