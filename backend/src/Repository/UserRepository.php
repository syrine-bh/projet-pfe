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

    public function getUsersWithClientRole()
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles LIKE :role')
            ->setParameter('role', '%"ROLE_CLIENT"%')
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