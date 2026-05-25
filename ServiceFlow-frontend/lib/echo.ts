import Echo from "laravel-echo"
import Pusher from "pusher-js"

let echoInstance: Echo | null = null

if (typeof window !== "undefined") {
  // Bind Pusher globally as required by laravel-echo
  ;(window as any).Pusher = Pusher

  // Retrieve environment configurations with local development fallback settings
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "npgwdfk1d4ecj5co9fea"
  const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1"
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: key,
    cluster: cluster,
    forceTLS: true,
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
