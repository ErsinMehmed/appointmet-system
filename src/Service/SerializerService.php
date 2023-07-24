<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Entity\Comment;
use App\Entity\Room;

class SerializerService
{
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

    public function serializeRoom(Room $room): array
    {
        return [
            'id' => $room->getId(),
            'number' => $room->getNumber(),
        ];
    }

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
