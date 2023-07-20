<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Appointment;
use App\Entity\Room;
use Doctrine\ORM\EntityManagerInterface;
use Ramsey\Uuid\Uuid;
use Faker\Factory;

class AppointmentSeeder extends Fixture
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $entities = [];

        for ($i = 1; $i <= 50; $i++) {
            $room = new Room();
            $room->setNumber($i);
            $manager->persist($room);
        }
        
        $manager->flush();

        for ($i = 0; $i < 100; $i++) {
            $appointment = new Appointment();
            $appointment->setUuid(Uuid::uuid4()->toString());
            $appointment->setName($faker->name);
            $appointment->setPersonalNumber($faker->numerify('##########'));
            $appointment->setTime($faker->dateTimeBetween('now', '+1 year'));
            $appointment->setDescription($faker->realText(50));

            $randomRoom = $this->getRandomRoom($manager);
            $appointment->setRoom($randomRoom);

            $entities[] = $appointment;
        }

        $this->entityManager->beginTransaction();

        try {
            foreach ($entities as $entity) {
                $this->entityManager->persist($entity);
            }

            $this->entityManager->flush();
            $this->entityManager->commit();
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            throw $e;
        }
    }

    // Помощен метод за избиране на случайна стая от базата данни
    private function getRandomRoom(ObjectManager $manager): Room
    {
        $repository = $manager->getRepository(Room::class);
        $count = $repository->createQueryBuilder('r')->select('COUNT(r)')->getQuery()->getSingleScalarResult();
        $offset = random_int(0, max(0, $count - 1));
        return $repository->createQueryBuilder('r')->setMaxResults(1)->setFirstResult($offset)->getQuery()->getSingleResult();
    }
}
