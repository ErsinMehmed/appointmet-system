<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Entity\Comment;
use App\Entity\Room;

class SerializerService
{
    /**
     * Serialize an Appointment object into an associative array.
     *
     * @param Appointment $appointment
     * @return array
     */
    public function serializeAppointment(Appointment $appointment): array
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

    /**
     * Serialize a Room object into an associative array.
     *
     * @param Room $room
     * @return array
     */
    public function serializeRoom(Room $room): array
    {
        return [
            'id' => $room->getId(),
            'name' => $room->getName(),
            'number' => $room->getNumber(),
        ];
    }

    /**
     * Serialize a Comment object into an associative array.
     *
     * @param Comment $comment
     * @return array
     */
    public function serializeComment(Comment $comment): array
    {
        return [
            'id' => $comment->getId(),
            'appointment_id' => $comment->getAppointmentId(),
            'text' => $comment->getText(),
            'date' => $comment->getDate(),
        ];
    }
}
