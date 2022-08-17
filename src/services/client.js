import axios from "axios";

export async function getUrlContent(url) {
  const uri = encodeURIComponent(url);
  const config = {
    method: "get",
    url: "http://localhost:3000/html/" + uri,
    headers: {},
  };

  return (await axios(config)).data;
}
