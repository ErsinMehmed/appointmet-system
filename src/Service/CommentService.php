<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use App\Entity\Comment;

class CommentService
{
    private $doctrine;
    private $dataValidatorService;

    public function __construct(ManagerRegistry $doctrine, DataValidatorService $dataValidatorService)
    {
        $this->doctrine = $doctrine;
        $this->dataValidatorService = $dataValidatorService;
    }

    public function create(array $data): array
    {
        $violations = $this->dataValidatorService->validateCommentData($data);

        if (count($violations) > 0) {
            $errorMessages = array();

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return ['comment' => null, 'errors' => $errorMessages];
        }

        $appointment = $this->doctrine->getRepository(Appointment::class)->find($data['appointment_id']);

        if (!$appointment) {
            return ['comment' => null, 'errors' => ['Appointment not found.']];
        }

        $comment = new Comment();
        $comment->setText($data['text']);
        $date = \DateTime::createFromFormat('Y-m-d', $data['date']);
        $comment->setDate($date);
        $comment->setAppointment($appointment);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($comment);
        $entityManager->flush();

        return ['comment' => $comment, 'errors' => []];
    }


    public function update(string $id, array $data): ?Comment
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

    public function delete(string $id): bool
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
