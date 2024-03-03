package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Outfit;

/**
 * Spring Data JPA repository for the Outfit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OutfitRepository extends JpaRepository<Outfit, Long> {}
