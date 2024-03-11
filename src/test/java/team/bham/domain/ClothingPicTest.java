package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ClothingPicTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClothingPic.class);
        ClothingPic clothingPic1 = new ClothingPic();
        clothingPic1.setId(1L);
        ClothingPic clothingPic2 = new ClothingPic();
        clothingPic2.setId(clothingPic1.getId());
        assertThat(clothingPic1).isEqualTo(clothingPic2);
        clothingPic2.setId(2L);
        assertThat(clothingPic1).isNotEqualTo(clothingPic2);
        clothingPic1.setId(null);
        assertThat(clothingPic1).isNotEqualTo(clothingPic2);
    }
}
