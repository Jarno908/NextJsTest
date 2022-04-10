import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const postId = req.query.id;

  const session = await getSession({ req });
  if(!session) { res.status(401) }

  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}