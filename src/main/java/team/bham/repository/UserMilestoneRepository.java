package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserMilestone;

/**
 * Spring Data JPA repository for the UserMilestone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserMilestoneRepository extends JpaRepository<UserMilestone, Long> {}
