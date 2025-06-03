// import { handlers } from "~/server/auth";

// export const { GET, POST } = handlers;

import { auth } from "~/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
