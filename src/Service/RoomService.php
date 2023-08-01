<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Room;

class RoomService
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
     * Creates a new room based on the provided data.
     *
     * @param array $data
     * @return array
     */
    public function create(array $data): array
    {
        $existingRoomNumber = $this->doctrine->getRepository(Room::class)->findOneBy(['number' => $data['number']]);

        if ($existingRoomNumber) {
            return ['room' => null, 'errors' => ['A room with this number already exists.']];
        }

        $existingRoomName = $this->doctrine->getRepository(Room::class)->findOneBy(['name' => $data['name']]);

        if ($existingRoomName) {
            return ['room' => null, 'errors' => ['A room with this name already exists.']];
        }

        $violations = $this->dataValidatorService->validateRoomData($data);

        if (count($violations) > 0) {
            $errorMessages = array();

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return ['room' => null, 'errors' => $errorMessages];
        }

        $room = new Room();
        $room->setName($data['name']);
        $room->setNumber($data['number']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($room);
        $entityManager->flush();

        return ['room' => $room, 'errors' => []];
    }

    /**
     * Updates an existing room based on the provided ID and data.
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function update(int $id, array $data): array
    {
        $room = $this->doctrine->getManager()->getRepository(Room::class)->findOneBy(['id' => $id]);

        if (!$room) {
            return ['room' => null, 'errors' => ['Room not found.']];
        }

        $existingRoomNumber = $this->doctrine->getRepository(Room::class)->findOneBy(['number' => $data['number']]);

        if ($existingRoomNumber && $existingRoomNumber->getId() !== $id) {
            return ['room' => null, 'errors' => ['A room with this number already exists.']];
        }

        $existingRoomName = $this->doctrine->getRepository(Room::class)->findOneBy(['name' => $data['name']]);

        if ($existingRoomName && $existingRoomName->getId() !== $id) {
            return ['room' => null, 'errors' => ['A room with this name already exists.']];
        }

        $violations = $this->dataValidatorService->validateRoomData($data);

        if (count($violations) > 0) {
            $errorMessages = array();

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return ['room' => null, 'errors' => $errorMessages];
        }

        $room->setName($data['name']);
        $room->setNumber($data['number']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->flush();

        return ['room' => $room, 'errors' => []];
    }

    /**
     * Deletes a room based on the provided ID.
     *
     * @param string $id
     * @return bool
     */
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
