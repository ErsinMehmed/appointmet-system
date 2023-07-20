<?php

namespace App\Controller\Api;

use App\Entity\Room;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

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
    public function store(ManagerRegistry $doctrine, Request $request): Response
    {
        $violations = $this->validateData($request->request->all());

        if (count($violations) > 0) {
            $errorMessages = [];

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return $this->json($errorMessages, 400);
        }

        $room = $doctrine->getRepository(Room::class)->find($request->request->get('room_id'));

        if (!$room) {
            return $this->json('Room not found', 404);
        }

        $appointment = new Appointment();
        $appointment->setUuid(Uuid::uuid4()->toString());
        $appointment->setName($request->request->get('name'));
        $appointment->setPersonalNumber($request->request->get('personal_number'));
        $time = \DateTime::createFromFormat('Y-m-d', $request->request->get('time'));
        $appointment->setTime($time);
        $appointment->setDescription($request->request->get('description'));
        $appointment->setRoom($room);

        $doctrine->getManager()->persist($appointment);
        $doctrine->getManager()->flush();

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
        $clientAppointments = $doctrine->getManager()->getRepository(Appointment::class)->createQueryBuilder('a')
            ->where('a.personal_number = :personalNumber')
            ->andWhere('a.time > :currentDateTime')
            ->setParameter('personalNumber', $appointment->getPersonalNumber())
            ->setParameter('currentDateTime', $currentDateTime)
            ->getQuery()
            ->getResult();

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
    public function update(ManagerRegistry $doctrine, Request $request, string $uuid): Response
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No appointment found', 404);
        }

        $violations = $this->validateData((array)json_decode($request->getContent()));

        if (count($violations) > 0) {
            $errorMessages = [];

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return $this->json($errorMessages, 400);
        }

        $content = json_decode($request->getContent());

        $room = $doctrine->getRepository(Room::class)->find($content->room_id);

        if (!$room) {
            return $this->json('Room not found', 404);
        }

        $appointment->setName($content->name);
        $appointment->setPersonalNumber($content->personal_number);
        $time = \DateTime::createFromFormat('Y-m-d', $content->time);
        $appointment->setTime($time);
        $appointment->setDescription($content->description);
        $appointment->setRoom($room);

        $doctrine->getManager()->flush();

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
    public function destroy(ManagerRegistry $doctrine, string $uuid): Response
    {
        $appointment = $doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No Appointment found', 404);
        }

        $doctrine->getManager()->remove($appointment);
        $doctrine->getManager()->flush();

        return $this->json('Deleted a Appointment successfully');
    }

    private function validateData($data)
    {
        $validator = Validation::createValidator();

        $constraints = new Assert\Collection([
            'name' => new Assert\NotBlank(['message' => 'Name is required.']),
            'personal_number' => [
                new Assert\NotBlank(['message' => 'Personal Number is required.']),
                new Assert\Regex([
                    'pattern' => '/^\d{10}$/',
                    'message' => 'Personal Number should be a 10-digit numeric value.',
                ]),
            ],
            'time' => [
                new Assert\NotBlank(['message' => 'Time is required.']),
                new Assert\DateTime([
                    'format' => 'Y-m-d',
                    'message' => 'Time should be a valid date in the format Y-m-d.',
                ]),
            ],
            'description' => new Assert\NotBlank(['message' => 'Description is required.']),
            'room_id' => new Assert\NotBlank(['message' => 'Room is required.']),
        ]);

        return $validator->validate($data, $constraints);
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
