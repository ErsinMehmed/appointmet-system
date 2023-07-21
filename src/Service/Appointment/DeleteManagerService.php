<?php

namespace App\Service;

use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;

class DeleteManagerService
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function destroy(string $uuid): bool
    {
        $appointment = $this->doctrine->getManager()->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return false;
        }

        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($appointment);
        $entityManager->flush();

        return true;
    }
}
