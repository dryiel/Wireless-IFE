const {PrismaClint} = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main(){
  // hash password def
const hashedPassword1 = await bcrypy.hash
