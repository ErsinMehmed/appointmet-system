<?php

namespace App\Service;

use App\Entity\Appointment;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Comment;

class StoreCommentManagerService
{
    private $validator;
    private $doctrine;
    private $dataValidatorService;

    public function __construct(ValidatorInterface $validator, ManagerRegistry $doctrine, DataValidatorService $dataValidatorService)
    {
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->dataValidatorService = $dataValidatorService;
    }

    public function storeComment(array $data): array
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
}
