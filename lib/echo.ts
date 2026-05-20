import Echo from "laravel-echo"
import Pusher from "pusher-js"

let echoInstance: Echo | null = null

if (typeof window !== "undefined") {
  // Bind Pusher globally as required by laravel-echo
  ;(window as any).Pusher = Pusher

  // Retrieve environment configurations with local development fallback settings
  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY || "npgwdfk1d4ecj5co9fea"
  const host = process.env.NEXT_PUBLIC_REVERB_HOST || "localhost"
  const port = process.env.NEXT_PUBLIC_REVERB_PORT || "8081"
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http"
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: key,
    wsHost: host,
    wsPort: parseInt(port, 10),
    wssPort: parseInt(port, 10),
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${apiBase}/broadcasting/auth`,
    auth: {
      headers: {
        get Authorization() {
          return `Bearer ${localStorage.getItem("token") || ""}`
        }
      }
    }
  })
}

export default echoInstance
