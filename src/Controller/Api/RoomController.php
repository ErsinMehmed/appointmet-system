<?php

namespace App\Controller;

use App\Entity\Room;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    /**
     * Index function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms', name: 'room_app', methods: 'GET')]
    public function index(ManagerRegistry $doctrine): Response
    {
        $rooms = $doctrine
            ->getRepository(Room::class)
            ->findAll();

        $data = [];

        foreach ($rooms as $room) {
            $data[] = $this->serializeData($room);
        }

        return $this->json($data);
    }

    private function serializeData(Room $room): array
    {
        return [
            'id' => $room->getId(),
            'number' => $room->getNumber(),
        ];
    }
}
