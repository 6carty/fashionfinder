package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.TrendingOutfit;

/**
 * Spring Data JPA repository for the TrendingOutfit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrendingOutfitRepository extends JpaRepository<TrendingOutfit, Long> {}
