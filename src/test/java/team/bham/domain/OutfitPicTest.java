package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class OutfitPicTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OutfitPic.class);
        OutfitPic outfitPic1 = new OutfitPic();
        outfitPic1.setId(1L);
        OutfitPic outfitPic2 = new OutfitPic();
        outfitPic2.setId(outfitPic1.getId());
        assertThat(outfitPic1).isEqualTo(outfitPic2);
        outfitPic2.setId(2L);
        assertThat(outfitPic1).isNotEqualTo(outfitPic2);
        outfitPic1.setId(null);
        assertThat(outfitPic1).isNotEqualTo(outfitPic2);
    }
}
