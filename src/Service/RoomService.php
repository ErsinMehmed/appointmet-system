<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Room;

class RoomService
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
        $violations = $this->dataValidatorService->validateRoomData($data);

        if (count($violations) > 0) {
            $errorMessages = array();

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return ['room' => null, 'errors' => $errorMessages];
        }

        $existingRoom = $this->doctrine->getRepository(Room::class)->findOneBy(['number' => $data['number']]);

        if ($existingRoom) {
            return ['room' => null, 'errors' => ['A room with this number already exists.']];
        }

        $room = new Room();
        $room->setName($data['name']);
        $room->setNumber($data['number']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($room);
        $entityManager->flush();

        return ['room' => $room, 'errors' => []];
    }


    public function delete(string $id): bool
    {
        $room = $this->doctrine->getManager()->getRepository(Room::class)->findOneBy(['id' => $id]);

        if (!$room) {
            return false;
        }

        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($room);
        $entityManager->flush();

        return true;
    }
}
