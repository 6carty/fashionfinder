package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.FashionTip;

/**
 * Spring Data JPA repository for the FashionTip entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FashionTipRepository extends JpaRepository<FashionTip, Long> {}
