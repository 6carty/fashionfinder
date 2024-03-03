package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.SaleListing;

/**
 * Spring Data JPA repository for the SaleListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SaleListingRepository extends JpaRepository<SaleListing, Long> {}
