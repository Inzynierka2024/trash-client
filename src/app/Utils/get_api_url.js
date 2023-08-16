import { useContext } from "react";
import { OptionsContext } from "../Logic/StateProvider";

export default function get_api_url() {
  const { API_URL } = useContext(OptionsContext);
  return API_URL;
}
