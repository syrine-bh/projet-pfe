<?php

namespace App\Repository;

use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->save($user, true);
    }

    public function getUsersWithAdminRole()
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role')
            ->setParameter('role', '%"ROLE_ADMIN"%')
            ->getQuery()
            ->getResult();
    }

    public function getProjectMembers(int $projectId){
        return $this->createQueryBuilder('u')
            ->innerJoin(Project::class, 'p', Join::WITH, 'p MEMBER OF u.memberProjects')
            ->andWhere('p.id = :projectId')
            ->setParameter('projectId', $projectId)
            ->getQuery()->getResult();
    }

    public function getPaginatedProjectMembers(int $projectId,int $offset,int $perPage){
        return $this->createQueryBuilder('u')
            ->innerJoin(Project::class, 'p', Join::WITH, 'p MEMBER OF u.memberProjects')
            ->andWhere('p.id = :projectId')
            ->setParameter('projectId', $projectId)
            ->setFirstResult($offset)
            ->setMaxResults($perPage)
            ->getQuery()->getResult();
    }

    public function getAllProjectMembers(int $projectId){
        return $this->createQueryBuilder('u')
            ->innerJoin(Project::class, 'p', Join::WITH, 'p MEMBER OF u.memberProjects')
            ->andWhere('p.id = :projectId')
            ->setParameter('projectId', $projectId)
            ->getQuery()->getResult();
    }

    public function getUsersWithClientRole()
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role')
            ->setParameter('role', '%"ROLE_CLIENT"%')
            ->getQuery()
            ->getResult();
    }

    public function getUsersWithMemberRole()
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role')
            ->setParameter('role', '%"ROLE_MEMBRE"%')
            ->getQuery()
            ->getResult();
    }

    public function getUsersWithMmebreGestionnaireRole()
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role1 OR u.roles LIKE :role2')
            ->setParameter('role1', '%"ROLE_GESTIONNAIRE"%')
            ->setParameter('role2', '%"ROLE_MEMBRE"%')
            ->getQuery()
            ->getResult();
    }

    public function getUserCount(): int
    {
        $qb = $this->createQueryBuilder('u');
        $qb->select('COUNT(u.id)');

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function getActiveUserCount(): int
    {
        $qb = $this->createQueryBuilder('u');
        $qb->select('COUNT(u.id)')
            ->where('u.isActive = :isActive')
            ->setParameter('isActive', true);

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function getUsersDistributionByRole(array $users): array
    {
        $distribution = [
            "ROLE_MEMBRE"=>0,
            "ROLE_ADMIN"=>0,
            "ROLE_GESTIONNAIRE"=>0,
            "ROLE_CLIENT"=>0,
            "Autres"=>0
        ];
        foreach ($users as $user) {
            if(in_array("ROLE_MEMBRE",$user->getRoles())){
                $distribution['ROLE_MEMBRE'] = $distribution['ROLE_MEMBRE']+1;
            }
            else if(in_array("ROLE_ADMIN",$user->getRoles())){
                $distribution['ROLE_ADMIN'] = $distribution['ROLE_ADMIN']+1;
            }
            else if(in_array("ROLE_GESTIONNAIRE",$user->getRoles())){
                $distribution['ROLE_GESTIONNAIRE'] = $distribution['ROLE_GESTIONNAIRE']+1;
            }
            else if(in_array("ROLE_CLIENT",$user->getRoles())){
                $distribution['ROLE_CLIENT'] = $distribution['ROLE_CLIENT']+1;
            }
            else{
                $distribution['Autres'] = $distribution['Autres']+1;
            }
        }

        return $distribution;
    }

    /*public function findTopUsersWithMostAssignedTickets()
    {
        $em = $this->getEntityManager();

        $dql = "
            SELECT u.email, COUNT(t.id) AS ticketCount
            FROM App\Entity\User u
            LEFT JOIN u.assignedTickets t
            GROUP BY u.id
            ORDER BY ticketCount DESC
        ";

        $query = $em->createQuery($dql)
            ->setMaxResults(5);

        return $query->getResult();
    }*/

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}