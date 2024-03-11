package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ClothingPic;

/**
 * Spring Data JPA repository for the ClothingPic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClothingPicRepository extends JpaRepository<ClothingPic, Long> {}
