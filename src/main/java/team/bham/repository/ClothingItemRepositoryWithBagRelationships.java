package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.ClothingItem;

public interface ClothingItemRepositoryWithBagRelationships {
    Optional<ClothingItem> fetchBagRelationships(Optional<ClothingItem> clothingItem);

    List<ClothingItem> fetchBagRelationships(List<ClothingItem> clothingItems);

    Page<ClothingItem> fetchBagRelationships(Page<ClothingItem> clothingItems);
}
