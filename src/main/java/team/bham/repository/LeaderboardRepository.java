package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Leaderboard;

/**
 * Spring Data JPA repository for the Leaderboard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {}
