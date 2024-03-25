package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.ExchangeRequest;

/**
 * Spring Data JPA repository for the ExchangeRequest entity.
 */
@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    default Optional<ExchangeRequest> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ExchangeRequest> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ExchangeRequest> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct exchangeRequest from ExchangeRequest exchangeRequest left join fetch exchangeRequest.clothingItem",
        countQuery = "select count(distinct exchangeRequest) from ExchangeRequest exchangeRequest"
    )
    Page<ExchangeRequest> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct exchangeRequest from ExchangeRequest exchangeRequest left join fetch exchangeRequest.clothingItem")
    List<ExchangeRequest> findAllWithToOneRelationships();

    @Query(
        "select exchangeRequest from ExchangeRequest exchangeRequest left join fetch exchangeRequest.clothingItem where exchangeRequest.id =:id"
    )
    Optional<ExchangeRequest> findOneWithToOneRelationships(@Param("id") Long id);
}
