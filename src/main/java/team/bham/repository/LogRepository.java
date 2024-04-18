package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Log;

/**
 * Spring Data JPA repository for the Log entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    @Query("select log from Log log where log.owner.login = ?#{authentication.name}")
    List<Log> findByOwnerIsCurrentUser();
}
