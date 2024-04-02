package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Outfit;

/**
 * Spring Data JPA repository for the Outfit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    @Query("select outfit from Outfit outfit where outfit.userCreated.login = ?#{principal.username}")
    List<Outfit> findByUserCreatedIsCurrentUser();
}
