import { PrismaClient } from "./generated/prisma";
import { Prisma } from "./generated/prisma";

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV != "production"){
    globalThis.prisma = db;
}