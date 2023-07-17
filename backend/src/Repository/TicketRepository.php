<?php

namespace App\Repository;

use App\Entity\Ticket;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ticket>
 *
 * @method Ticket|null find($id, $lockMode = null, $lockVersion = null)
 * @method Ticket|null findOneBy(array $criteria, array $orderBy = null)
 * @method Ticket[]    findAll()
 * @method Ticket[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TicketRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ticket::class);
    }

    public function save(Ticket $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Ticket $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getTicketCount(): int
    {
        $qb = $this->createQueryBuilder('u');
        $qb->select('COUNT(u.id)');

        return (int) $qb->getQuery()->getSingleScalarResult();
    }
    public function getNumberOfOpenTickets(): int
    {
        $qb = $this->createQueryBuilder('t');
        $qb->select('COUNT(t.id) AS openTicketCount')
            ->where($qb->expr()->in('t.status', ':openStatuses'))
            ->setParameter('openStatuses', ['Requested', 'Todo', 'InProgress']);

        $result = $qb->getQuery()->getSingleScalarResult();

        return (int) $result;
    }

    public function getNumberOfClosedTickets()
    {
        $qb = $this->createQueryBuilder('t');
        $qb->select('COUNT(t.id) AS openTicketCount')
            ->where($qb->expr()->in('t.status', ':closedStatuses'))
            ->setParameter('closedStatuses', 'Done');

        $result = $qb->getQuery()->getSingleScalarResult();

        return (int) $result;
    }

    public function getTicketDistributionByPriority(): array
    {
        $qb = $this->createQueryBuilder('t');
        $qb->select('COUNT(t.id) AS ticketCount', 't.priority AS ticketPriority')
            ->groupBy('t.priority');

        $results = $qb->getQuery()->getResult();

        $totalTickets = 0;
        $distribution = [];

        foreach ($results as $result) {
            $ticketCount = (int) $result['ticketCount'];
            $ticketPriority = $result['ticketPriority'];

            $totalTickets += $ticketCount;
            $distribution[$ticketPriority] = $ticketCount;
        }

        // Calculate the percentage distribution
        foreach ($distribution as &$count) {
            $count = round(($count / $totalTickets) * 100, 2);
        }

        return $distribution;
    }

//    /**
//     * @return Ticket[] Returns an array of Ticket objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Ticket
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
