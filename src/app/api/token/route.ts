import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    const clientID = process.env.SPOTIFY_CLIENT_ID || "";
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientID,
        client_secret: clientSecret,
      }),
    });

    const data = await res.json();
    const expires = new Date(Date.now() + data.expires_in * 1000).toUTCString();
    console.log(expires);

    return new Response(
      JSON.stringify({ msg: "ok", token: data.access_token }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `access_token=${data.access_token};Path=/;Expires=${expires};Secure;HttpOnly`,
        },
      }
    );
  } else {
    return new Response(
      JSON.stringify({ msg: "no change ok", token: token.value }),
      {
        status: 200,
      }
    );
  }
}
