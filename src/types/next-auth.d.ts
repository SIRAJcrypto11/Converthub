import { DefaultSession, User as NextAuthUser } from "next-auth";
import { AdapterUser as BaseAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"];
    }

    interface User extends NextAuthUser {
        role: string;
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends BaseAdapterUser {
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
    }
}
