package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PurchaseListing;

/**
 * Spring Data JPA repository for the PurchaseListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseListingRepository extends JpaRepository<PurchaseListing, Long> {}
