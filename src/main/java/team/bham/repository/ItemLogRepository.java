package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ItemLog;

/**
 * Spring Data JPA repository for the ItemLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemLogRepository extends JpaRepository<ItemLog, Long> {
    @Query("select itemLog from ItemLog itemLog where itemLog.owner.login = ?#{authentication.name}")
    List<ItemLog> findByOwnerIsCurrentUser();
}
