<?php

namespace App\Controller;

use App\Entity\Room;
use App\Service\SerializerService;
use Symfony\Component\HttpFoundation\Request;
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
    public function index(SerializerService $serializerService, ManagerRegistry $doctrine): Response
    {
        $rooms = $doctrine
            ->getRepository(Room::class)
            ->findAll();

        $data = [];

        foreach ($rooms as $room) {
            $data[] = $serializerService->serializeRoom($room);
        }

        return $this->json($data);
    }

    /**
     * Store function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms', name: 'add_room', methods: 'POST')]
    public function store(Request $request): Response
    {
        $roomData = $request->request->all();
        $room = $storeManagerService->storeRoom($roomData);

        if (is_array($room)) {
            $room = (object)$room;
        }

        if (count($room->errors) > 0) {
            return $this->json(['errors' => $room->errors], 400);
        }

        if (!$room) {
            return $this->json(404);
        }

        return $this->json('New room has been added successfully!');
    }
}
