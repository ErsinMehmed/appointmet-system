<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use App\Entity\Comment;

class CommentService
{
    private $doctrine;

    private $dataValidatorService;

    /**
     * Constructor of the class.
     *
     * @param ManagerRegistry $doctrine
     * @param DataValidatorService $dataValidatorService
     */
    public function __construct(ManagerRegistry $doctrine, DataValidatorService $dataValidatorService)
    {
        $this->doctrine = $doctrine;
        $this->dataValidatorService = $dataValidatorService;
    }

    /**
     * Creates a new comment associated with an appointment based on the provided data.
     *
     * @param array $data
     * @return array
     */
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

    /**
     * Updates an existing comment based on the provided ID and data.
     *
     * @param string $id
     * @param array $data
     * @return Comment|null
     */
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

    /**
     * Deletes a comment based on the provided ID.
     *
     * @param string $id
     * @return bool
     */
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
