<?php

namespace App\Controller;

use App\Entity\Room;
use App\Service\PaginationService;
use App\Service\RoomService;
use App\Service\SerializerService;
use App\Service\TableFilterService;
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
     * @param \App\Services\RoomService $createManagerService
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms', name: 'add_room', methods: 'POST')]
    public function store(RoomService $createManagerService, Request $request): Response
    {
        $roomData = $request->request->all();
        $room = $createManagerService->create($roomData);

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

    /**
     * Destroy function
     *
     * @param \App\Services\RoomService $storeManagerService
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms/{id}', name: 'room_delete', methods: 'DELETE')]
    public function destroy(RoomService $deleteManagerService, int $id): Response
    {
        try {
            $isDeleted = $deleteManagerService->delete($id);

            if (!$isDeleted) {
                return $this->json(404);
            }

            return $this->json('Room has been deleted successfully!');
        } catch (\Exception $e) {
            return $this->json('This room can not be deleted! There are appointments scheduled in this room!', 500);
        }
    }

    /**
     * Table function
     *
     * @param \App\Services\SerializerService $serializerService
     * @param \App\Services\TableFilterService $tableFilterService
     * @param \App\Services\PaginationService $paginationService
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/all-rooms', name: 'room_table', methods: 'GET')]
    public function getTable(Request $request, SerializerService $serializerService, TableFilterService $tableFilterService, PaginationService $paginationService): Response
    {
        $perPage = $request->query->getInt('per_page', 10);
        $currentPage = $request->query->getInt('page', 1);
        $name = $request->query->get('name', '');
        $roomNumber = $request->query->getInt('room_number');

        $rooms = $tableFilterService->filterRoomData($name, $roomNumber);

        $data = [];

        foreach ($rooms as $room) {
            $data[] = $serializerService->serializeRoom($room);
        }

        $paginationResult = $paginationService->paginate($data, $currentPage, $perPage);

        return $this->json($paginationResult);
    }
}
