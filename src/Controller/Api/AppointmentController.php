<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use App\Service\DeleteAppointmentManagerService;
use App\Service\PaginationService;
use App\Service\SerializerService;
use App\Service\StoreAppointmentManagerService;
use App\Service\TableFilterService;
use App\Service\UpdateAppointmentManagerService;

class AppointmentController extends AbstractController
{
    /**
     * Index function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments', name: 'appointment_app', methods: 'GET')]
    public function index(Request $request, SerializerService $serializerService, TableFilterService $tableFilterService, PaginationService $paginationService, ManagerRegistry $doctrine): Response
    {
        $perPage = $request->query->getInt('per_page', 10);
        $currentPage = $request->query->getInt('page', 1);
        $personalNumber = $request->query->getInt('personal_number');
        $name = $request->query->get('name', '');
        $dateFrom = $request->query->get('date_from', '');
        $dateTo = $request->query->get('date_to', '');

        $appointments = $doctrine
            ->getRepository(Appointment::class)
            ->findAll();

        $data = [];

        foreach ($appointments as $appointment) {
            $appointmentData = $serializerService->serializeAppointment($appointment);

            $room = $appointment->getRoom();

            if ($room) {
                $roomData = $serializerService->serializeRoom($room);
                $appointmentData['room'] = $roomData;
            }

            $data[] = $appointmentData;
        }

        $filteredData = $tableFilterService->filterData($data, $personalNumber, $name, $dateFrom, $dateTo);

        $paginationResult = $paginationService->paginate($filteredData, $currentPage, $perPage);

        return $this->json($paginationResult);
    }



    /**
     * Store function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments', name: 'add_appointment', methods: 'POST')]
    public function store(StoreAppointmentManagerService $storeManagerService, Request $request): Response
    {
        $appointmentData = $request->request->all();
        $appointment = $storeManagerService->storeAppointment($appointmentData);

        if (is_array($appointment)) {
            $appointment = (object)$appointment;
        }

        if (count($appointment->errors) > 0) {
            return $this->json(['errors' => $appointment->errors], 400);
        }

        if (!$appointment) {
            return $this->json(404);
        }

        return $this->json('New appointment has been added successfully!');
    }

    /**
     * Show function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param string $uuid
     * @return void
     */
    #[Route('/appointments/show/{uuid}', name: 'appointment_show', methods: 'GET')]
    public function show(SerializerService $serializerService, ManagerRegistry $doctrine, Request $request, string $uuid)
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json(404);
        }

        $data = $serializerService->serializeAppointment($appointment);

        $comments = [];

        foreach ($appointment->getComments() as $comment) {
            $comments[] = $serializerService->serializeComment($comment);
        }

        $currentDateTime = new \DateTime();

        $clientAppointments = $doctrine->getManager()->getRepository(Appointment::class)->getClientAppointments(
            $appointment->getPersonalNumber(),
            $currentDateTime
        );

        $otherAppointments = [];
        $commentOtherAppointments = [];

        foreach ($clientAppointments as $clientAppointment) {
            if ($clientAppointment->getTime() !== $appointment->getTime()) {
                $otherAppointments[] = $serializerService->serializeAppointment($clientAppointment);

                foreach ($clientAppointment->getComments() as $comment) {
                    $commentOtherAppointments[] = $serializerService->serializeComment($comment);
                }
            }
        }

        $acceptHeader = $request->headers->get('Accept');

        if ($acceptHeader && strpos($acceptHeader, 'application/json') !== false) {
            return $this->json([
                'entity' => $data,
                'otherAppointments' => $otherAppointments,
                'comments' => $comments,
                'commentOtherAppointments' => $commentOtherAppointments,
            ]);
        }

        return $this->render('reactapp/index.html.twig');
    }

    /**
     * Edit function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param string $uuid
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments/edit/{uuid}', name: 'appointment_edit', methods: 'GET')]
    public function edit(SerializerService $serializerService, ManagerRegistry $doctrine, Request $request, string $uuid): Response
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json(404);
        }

        $data = $serializerService->serializeAppointment($appointment);

        $room = $appointment->getRoom();
        $roomData = null;

        if ($room) {
            $roomData = $serializerService->serializeRoom($room);
        }

        $acceptHeader = $request->headers->get('Accept');

        if ($acceptHeader && strpos($acceptHeader, 'application/json') !== false) {
            return $this->json([
                'appointment' => $data,
                'room' => $roomData,
            ]);
        }

        return $this->render('reactapp/index.html.twig');
    }

    /**
     * Update function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param string $uuid
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments/{uuid}', name: 'appointment_update', methods: 'PUT')]
    public function update(UpdateAppointmentManagerService $updateManagerService, Request $request, string $uuid): Response
    {
        $appointmentData = (array)json_decode($request->getContent());
        $appointment = $updateManagerService->updateAppointment($uuid, $appointmentData);

        if (is_array($appointment)) {
            $appointment = (object)$appointment;
        }

        if (count($appointment->errors)) {
            return $this->json(['errors' => $appointment->errors], 400);
        }

        if (!$appointment) {
            return $this->json(404);
        }

        return $this->json('Appointment has been updated successfully!');
    }

    /**
     * Destroy function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param string $uuid
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments/{uuid}', name: 'appointment_delete', methods: 'DELETE')]
    public function destroy(DeleteAppointmentManagerService $deleteManagerService, string $uuid): Response
    {
        $isDeleted = $deleteManagerService->destroy($uuid);

        if (!$isDeleted) {
            return $this->json(404);
        }

        return $this->json('Appointment has been deleted successfully!');
    }
}
