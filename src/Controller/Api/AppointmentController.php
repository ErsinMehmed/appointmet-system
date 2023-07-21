<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use App\Entity\Room;
use App\Service\DeleteManagerService;
use App\Service\StoreManagerService;
use App\Service\UpdateManagerService;

class AppointmentController extends AbstractController
{
    /**
     * Index function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments', name: 'appointment_app', methods: 'GET')]
    public function index(ManagerRegistry $doctrine): Response
    {
        $appointments = $doctrine
            ->getRepository(Appointment::class)
            ->findAll();

        $data = [];

        foreach ($appointments as $appointment) {
            $appointmentData = $this->serializeData($appointment);

            $room = $appointment->getRoom();

            if ($room) {
                $roomData = $this->serializeRoom($room);
                $appointmentData['room'] = $roomData;
            }

            $data[] = $appointmentData;
        }

        return $this->json($data);
    }

    /**
     * Create function
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments/create', name: 'appointment_create', methods: 'GET')]
    public function create(): Response
    {
        return $this->render('reactapp/index.html.twig');
    }

    /**
     * Store function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments', name: 'add_appointment', methods: 'POST')]
    public function store(StoreManagerService $storeManagerService, Request $request): Response
    {
        $appointmentData = $request->request->all();
        $appointment = $storeManagerService->storeAppointment($appointmentData);

        if (!$appointment) {
            return $this->json('An error occurred while creating the appointment', 400);
        }

        return $this->json('New appointment has been added successfully');
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
    public function show(ManagerRegistry $doctrine, Request $request, string $uuid)
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            throw $this->createNotFoundException('Appointment not found.');
        }

        $data = [
            'name' => $appointment->getName(),
            'personal_number' => $appointment->getPersonalNumber(),
            'time' => $appointment->getTime(),
            'description' => $appointment->getDescription(),
        ];

        $currentDateTime = new \DateTime();

        $clientAppointments = $doctrine->getManager()->getRepository(Appointment::class)->getClientAppointments(
            $appointment->getPersonalNumber(),
            $currentDateTime
        );

        $otherAppointments = [];

        foreach ($clientAppointments as $clientAppointment) {
            if ($clientAppointment->getTime() !== $appointment->getTime()) {
                $otherAppointments[] = [
                    'name' => $clientAppointment->getName(),
                    'personal_number' => $clientAppointment->getPersonalNumber(),
                    'time' => $clientAppointment->getTime(),
                    'description' => $clientAppointment->getDescription(),
                ];
            }
        }

        $acceptHeader = $request->headers->get('Accept');

        if ($acceptHeader && strpos($acceptHeader, 'application/json') !== false) {
            return $this->json([
                'entity' => $data,
                'otherAppointments' => $otherAppointments,
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
    public function edit(ManagerRegistry $doctrine, Request $request, string $uuid): Response
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No Appointment found', 404);
        }

        $data = $this->serializeData($appointment);

        $room = $appointment->getRoom();
        $roomData = null;

        if ($room) {
            $roomData = $this->serializeRoom($room);
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
    public function update(UpdateManagerService $updateManagerService, Request $request, string $uuid): Response
    {
        $appointmentData = (array)json_decode($request->getContent());
        $appointment = $updateManagerService->updateAppointment($uuid, $appointmentData);

        if (!$appointment) {
            return $this->json('No appointment found', 404);
        }

        return $this->json('Appointment has been updated successfully');
    }

    /**
     * Destroy function
     *
     * @param \Doctrine\Persistence\ManagerRegistry $doctrine
     * @param string $uuid
     * @return \Symfony\Component\HttpFoundation\Response
     */
    #[Route('/appointments/{uuid}', name: 'appointment_delete', methods: 'DELETE')]
    public function destroy(DeleteManagerService $deleteManagerService, string $uuid): Response
    {
        $isDeleted = $deleteManagerService->destroy($uuid);

        if (!$isDeleted) {
            return $this->json('No Appointment found', 404);
        }

        return $this->json('Deleted a Appointment successfully');
    }

    private function serializeData(Appointment $appointment): array
    {
        return [
            'id' => $appointment->getId(),
            'uuid' => $appointment->getUuid(),
            'name' => $appointment->getName(),
            'personalNumber' => $appointment->getPersonalNumber(),
            'time' => $appointment->getTime(),
            'description' => $appointment->getDescription(),
        ];
    }

    private function serializeRoom(Room $room): array
    {
        return [
            'id' => $room->getId(),
            'number' => $room->getNumber(),
        ];
    }
}
