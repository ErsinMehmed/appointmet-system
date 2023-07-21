<?php 

namespace App\Service;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\Persistence\ManagerRegistry;
use Ramsey\Uuid\Uuid;
use App\Entity\Appointment;
use App\Entity\Room;

class StoreAppointmentManagerService
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

    public function storeAppointment(array $data): ?Appointment
    {
        $violations = $this->dataValidatorService->validateAppointmentData($data);
       
        if (count($violations) > 0) {
            return null;
        }

        $room = $this->doctrine->getRepository(Room::class)->find($data['room_id']);

        if (!$room) {
            return null;
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

        return $appointment;
    }
}
