package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class TrendingOutfitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TrendingOutfit.class);
        TrendingOutfit trendingOutfit1 = new TrendingOutfit();
        trendingOutfit1.setId(1L);
        TrendingOutfit trendingOutfit2 = new TrendingOutfit();
        trendingOutfit2.setId(trendingOutfit1.getId());
        assertThat(trendingOutfit1).isEqualTo(trendingOutfit2);
        trendingOutfit2.setId(2L);
        assertThat(trendingOutfit1).isNotEqualTo(trendingOutfit2);
        trendingOutfit1.setId(null);
        assertThat(trendingOutfit1).isNotEqualTo(trendingOutfit2);
    }
}
