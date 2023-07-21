<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Comment;

class UpdateCommentManagerService
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function updateComment(string $id, array $data): ?Comment
    {
        $comment = $this->doctrine->getManager()->getRepository(Comment::class)->findOneBy(['id' => $id]);

        if (!$comment) {
            return null;
        }

        $comment->setText($data['text']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();

        return $comment;
    }
}
