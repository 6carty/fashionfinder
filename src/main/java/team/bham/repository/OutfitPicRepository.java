package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.OutfitPic;

/**
 * Spring Data JPA repository for the OutfitPic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OutfitPicRepository extends JpaRepository<OutfitPic, Long> {}
