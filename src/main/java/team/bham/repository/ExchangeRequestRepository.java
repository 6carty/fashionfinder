package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ExchangeRequest;

/**
 * Spring Data JPA repository for the ExchangeRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {}
