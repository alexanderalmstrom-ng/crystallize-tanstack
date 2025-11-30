import { useSession } from "@tanstack/react-start/server";
import { env } from "@/env";

type AppSession = {
  token: string;
};

export function useAppSession() {
  return useSession<AppSession>({
    name: "session",
    password: env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 2592000, // 30 days
    },
  });
}
