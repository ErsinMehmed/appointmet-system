<?php

namespace App\Repository;

use App\Entity\Room;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends AbstractRepository<Room>
 *
 * @method Room|null find($id, $lockMode = null, $lockVersion = null)
 * @method Room|null findOneBy(array $criteria, array $orderBy = null)
 * @method Room[]    findAll()
 * @method Room[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RoomRepository extends AbstractRepository
{
    private $queryBuilder;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
        $this->queryBuilder = $this->createQueryBuilder('a');
    }

    public function findByName(string $name)
    {
        return parent::findByLike($this->queryBuilder, 'name', $name);
    }

    public function findByRoomNumber(int $number)
    {
        return parent::findByLike($this->queryBuilder, 'number', $number);
    }

    public function pagination($currentPage, $perPage)
    {
        return parent::findPaginatedResults($currentPage, $perPage);
    }

    public function countData()
    {
        return parent::getCount($this->queryBuilder);
    }

    //    /**
    //     * @return Room[] Returns an array of Room objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Room
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
