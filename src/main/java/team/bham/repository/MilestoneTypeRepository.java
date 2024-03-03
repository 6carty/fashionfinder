package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MilestoneType;

/**
 * Spring Data JPA repository for the MilestoneType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MilestoneTypeRepository extends JpaRepository<MilestoneType, Long> {}
