import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

  if (req.method === "GET") {
    const item = await prisma.papyItem.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const { title, content } = req.body;
    const updated = await prisma.papyItem.update({ where: { id }, data: { title, content } });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.papyItem.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.setHeader("Allow", "GET, PUT, DELETE").status(405).end();
  }
