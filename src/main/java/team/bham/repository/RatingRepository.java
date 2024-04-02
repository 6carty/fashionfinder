package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Rating;

/**
 * Spring Data JPA repository for the Rating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("select rating from Rating rating where rating.userRated.login = ?#{principal.username}")
    List<Rating> findByUserRatedIsCurrentUser();
}
