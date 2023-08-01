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
            return $this->json(['status' => false, 'errors' => $room->errors]);
        }

        if (!$room) {
            return $this->json(['status' => false, 'message' => 'An error occurred while creating the room!']);
        }

        return $this->json(['status' => true, 'message' => 'Room has been added successfully!']);
    }

    /**
     * Edit function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms/edit/{id}', name: 'room_edit', methods: 'GET')]
    public function edit(SerializerService $serializerService, ManagerRegistry $doctrine, Request $request, int $id): Response
    {
        $room = $doctrine->getManager()->getRepository(Room::class)->findOneBy(['id' => $id]);

        if (!$room) {
            return $this->json(['status' => false, 'message' => 'No room found!']);
        }

        $data = $serializerService->serializeRoom($room);

        $acceptHeader = $request->headers->get('Accept');

        if ($acceptHeader && strpos($acceptHeader, 'application/json') !== false) {
            return $this->json(['room' => $data]);
        }

        return $this->render('reactapp/index.html.twig');
    }

    /**
     * Update function
     *
     * @param \App\Services\RoomService $updateManagerService
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/rooms/{id}', name: 'room_update', methods: 'PUT')]
    public function update(RoomService $updateManagerService, Request $request, int $id): Response
    {
        $roomData = (array)json_decode($request->getContent());
        $room = $updateManagerService->update($id, $roomData);

        if (is_array($room)) {
            $room = (object)$room;
        }

        if (count($room->errors)) {
            return $this->json(['status' => false, 'errors' => $room->errors]);
        }

        if (!$room) {
            return $this->json(['status' => false, 'message' => 'An error occurred while updating the room']);
        }

        return $this->json(['status' => true, 'message' => 'Room has been updated successfully!']);
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
                return $this->json(['status' => false, 'message' => 'No room found!']);
            }

            return $this->json(['status' => true, 'message' => 'Room has been deleted successfully!']);
        } catch (\Exception $e) {
            return $this->json(['status' => false, 'message' => 'This room can not be deleted! There are appointments scheduled in this room!']);
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
    public function getTable(Request $request, SerializerService $serializerService, TableFilterService $tableFilterService, PaginationService $paginationService, ManagerRegistry $doctrine): Response
    {
        $perPage = $request->query->getInt('per_page', 10);
        $currentPage = $request->query->getInt('page', 1);
        $name = $request->query->get('name', '');
        $roomNumber = $request->query->getInt('room_number');

        $rooms = $tableFilterService->filterRoomData($name, $roomNumber, $currentPage, $perPage);

        $totalItems = $rooms['filtered'] ? count($rooms['room']) : $doctrine->getManager()->getRepository(Room::class)->countData();
        $totalPages = max(ceil($totalItems / $perPage), 1);

        $data = [];

        foreach ($rooms['room'] as $room) {
            $data[] = $serializerService->serializeRoom($room);
        }

        if ($rooms['filtered']) {
            $data = $paginationService->paginate($data, $currentPage, $perPage);
        } else {
            $data =  [
                'entity' => $data,
                'pagination' => [
                    'current_page' => $currentPage,
                    'total_pages' => $totalPages,
                    'total_items' => $totalItems,
                    'per_page' => $perPage,
                ],
            ];
        }

        return $this->json($data);
    }
}
