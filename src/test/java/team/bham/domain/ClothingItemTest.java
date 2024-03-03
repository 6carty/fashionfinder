package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ClothingItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClothingItem.class);
        ClothingItem clothingItem1 = new ClothingItem();
        clothingItem1.setId(1L);
        ClothingItem clothingItem2 = new ClothingItem();
        clothingItem2.setId(clothingItem1.getId());
        assertThat(clothingItem1).isEqualTo(clothingItem2);
        clothingItem2.setId(2L);
        assertThat(clothingItem1).isNotEqualTo(clothingItem2);
        clothingItem1.setId(null);
        assertThat(clothingItem1).isNotEqualTo(clothingItem2);
    }
}
