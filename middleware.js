import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
export const config = {
  matcher: [
    // Exclure les fichiers statiques courants
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|img.png|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.gif$|$).*)",
  ],
};

export default withAuth;
