package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class OutfitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Outfit.class);
        Outfit outfit1 = new Outfit();
        outfit1.setId(1L);
        Outfit outfit2 = new Outfit();
        outfit2.setId(outfit1.getId());
        assertThat(outfit1).isEqualTo(outfit2);
        outfit2.setId(2L);
        assertThat(outfit1).isNotEqualTo(outfit2);
        outfit1.setId(null);
        assertThat(outfit1).isNotEqualTo(outfit2);
    }
}
