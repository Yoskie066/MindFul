import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
declare const prisma: PrismaClient<{
    adapter: PrismaMariaDb;
    log: ("error" | "warn")[];
}, "error" | "warn", import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map