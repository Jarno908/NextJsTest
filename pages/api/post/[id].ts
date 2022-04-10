import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

// DELETE /api/post/:id
export default async function handle(req, res) {
  const postId = req.query.id;

  const session = await getSession({ req });
  if(!session) { res.status(401) }

  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}