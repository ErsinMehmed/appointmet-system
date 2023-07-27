<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use Ramsey\Uuid\Uuid;
use App\Entity\Appointment;
use App\Entity\Room;

class AppointmentService
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

        $appointment = new Appointment();
        $appointment->setUuid(Uuid::uuid4()->toString());
        $appointment->setName($data['name']);
        $appointment->setPersonalNumber($data['personal_number']);
        $time = \DateTime::createFromFormat('Y-m-d', $data['time']);
        $appointment->setTime($time);
        $appointment->setDescription($data['description']);
        $appointment->setRoom($room);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($appointment);
        $entityManager->flush();

        return ['appointment' => $appointment, 'errors' => []];
    }

    public function update(string $uuid, array $data): array
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

    public function delete(string $uuid): bool
    {
        $appointment = $this->doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return false;
        }

        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($appointment);
        $entityManager->flush();

        return true;
    }
}
