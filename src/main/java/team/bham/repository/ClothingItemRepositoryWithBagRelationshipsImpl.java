package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.ClothingItem;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ClothingItemRepositoryWithBagRelationshipsImpl implements ClothingItemRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ClothingItem> fetchBagRelationships(Optional<ClothingItem> clothingItem) {
        return clothingItem.map(this::fetchOutfits);
    }

    @Override
    public Page<ClothingItem> fetchBagRelationships(Page<ClothingItem> clothingItems) {
        return new PageImpl<>(
            fetchBagRelationships(clothingItems.getContent()),
            clothingItems.getPageable(),
            clothingItems.getTotalElements()
        );
    }

    @Override
    public List<ClothingItem> fetchBagRelationships(List<ClothingItem> clothingItems) {
        return Optional.of(clothingItems).map(this::fetchOutfits).orElse(Collections.emptyList());
    }

    ClothingItem fetchOutfits(ClothingItem result) {
        return entityManager
            .createQuery(
                "select clothingItem from ClothingItem clothingItem left join fetch clothingItem.outfits where clothingItem is :clothingItem",
                ClothingItem.class
            )
            .setParameter("clothingItem", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<ClothingItem> fetchOutfits(List<ClothingItem> clothingItems) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, clothingItems.size()).forEach(index -> order.put(clothingItems.get(index).getId(), index));
        List<ClothingItem> result = entityManager
            .createQuery(
                "select distinct clothingItem from ClothingItem clothingItem left join fetch clothingItem.outfits where clothingItem in :clothingItems",
                ClothingItem.class
            )
            .setParameter("clothingItems", clothingItems)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
