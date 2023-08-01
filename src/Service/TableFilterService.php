<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Entity\Room;
use Doctrine\Persistence\ManagerRegistry;

class TableFilterService
{
    private $doctrine;

    /**
     * Constructor for the class.
     *
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Filter appointment data based on given parameters.
     *
     * @param string $personalNumber
     * @param string $name
     * @param string $dateFrom
     * @param string $dateTo
     * @param int $currentPage
     * @param int $perPage
     * @return array
     */
    public function filterAppointmentData(string $personalNumber, string $name, string $dateFrom, string $dateTo, int $currentPage, int $perPage): array
    {
        $appointmentRepository = $this->doctrine->getManager()->getRepository(Appointment::class);
        $filteredAppointments = [];

        if ($personalNumber) {
            $filteredAppointments = ['filtered' => true, 'appointment' => $appointmentRepository->findByPersonalNumber($personalNumber)];
        }

        if ($name) {
            $filteredAppointments = ['filtered' => true, 'appointment' => $appointmentRepository->findByName($name)];
        }

        if ($dateFrom || $dateTo) {
            $filteredAppointments = ['filtered' => true, 'appointment' => $appointmentRepository->findByDateRange($dateFrom, $dateTo)];
        }

        if (!$personalNumber && !$name && !$dateFrom && !$dateTo) {
            $filteredAppointments = ['filtered' => false, 'appointment' => $appointmentRepository->pagination($currentPage, $perPage)];
        }

        return $filteredAppointments;
    }

    public function filterRoomData(string $name, int $roomNumber, int $currentPage, int $perPage): array
    {
        $roomRepository = $this->doctrine->getManager()->getRepository(Room::class);
        $filteredRooms = [];

        if ($name) {
            $filteredRooms = ['filtered' => true, 'room' => $roomRepository->findByName($name)];
        }

        if ($roomNumber) {
            $filteredRooms = ['filtered' => true, 'room' => $roomRepository->findByRoomNumber($roomNumber)];
        }

        if (!$name && !$roomNumber) {
            $filteredRooms = ['filtered' => false, 'room' => $roomRepository->pagination($currentPage, $perPage)];
        }

        return $filteredRooms;
    }
}
