import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { compareSync, hash } from "bcrypt";
import { omit } from "lodash";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}


// POST /api/user
async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if(user){
    console.log(compareSync(req.body.password, user?.password));
  }

  if (user && compareSync(req.body.password, user.password)) {
    res.json(omit(user, "password"));
  } else {
    res.status(400).end('{ "error": "Invalid credentials"}');
  }
}