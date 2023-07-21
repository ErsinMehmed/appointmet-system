<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Comment;

class DeleteCommentManagerService
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function destroy(string $id): bool
    {
        $comment = $this->doctrine->getManager()->getRepository(Comment::class)->findOneBy(['id' => $id]);

        if (!$comment) {
            return false;
        }

        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($comment);
        $entityManager->flush();

        return true;
    }
}
