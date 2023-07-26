<?php

namespace App\Service;

use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class DataValidatorService
{
    public function validateAppointmentData(array $data)
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

    public function validateCommentData(array $data)
    {
        $validator = Validation::createValidator();

        $constraints = new Assert\Collection([
            'text' => new Assert\NotBlank(['message' => 'Text is required.']),
            'date' => [
                new Assert\NotBlank(['message' => 'Date is required.']),
                new Assert\DateTime([
                    'format' => 'Y-m-d',
                    'message' => 'Time should be a valid date in the format Y-m-d.',
                ]),
            ],
            'appointment_id' => new Assert\NotBlank(['message' => 'Appointment is required.']),
        ]);

        return $validator->validate($data, $constraints);
    }

    public function validateRoomData(array $data)
    {
        $validator = Validation::createValidator();

        $constraints = new Assert\Collection([
            'name' => new Assert\NotBlank(['message' => 'Name is required.']),
            'number' => new Assert\NotBlank(['message' => 'Number is required.']),
        ]);

        return $validator->validate($data, $constraints);
    }
}
