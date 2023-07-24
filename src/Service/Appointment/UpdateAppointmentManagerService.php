<?php

namespace App\Service;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use App\Entity\Room;

class UpdateAppointmentManagerService
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

    public function updateAppointment(string $uuid, array $data): array
    {
        $appointment = $this->doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return ['appointment' => null, 'errors' => ['Appointment not found.']];
        }

        $violations = $this->dataValidatorService->validateAppointmentData($data);

        if (count($violations) > 0) {
            $errorMessages = array();

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return ['appointment' => null, 'errors' => $errorMessages];
        }

        $room = $this->doctrine->getRepository(Room::class)->find($data['room_id']);

        if (!$room) {
            return ['appointment' => null, 'errors' => ['Room not found.']];
        }

        $appointment->setName($data['name']);
        $appointment->setPersonalNumber($data['personal_number']);
        $time = \DateTime::createFromFormat('Y-m-d', $data['time']);
        $appointment->setTime($time);
        $appointment->setDescription($data['description']);
        $appointment->setRoom($room);

        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();

        return ['appointment' => $appointment, 'errors' => []];
    }
}
