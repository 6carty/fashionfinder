package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FashionTipTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FashionTip.class);
        FashionTip fashionTip1 = new FashionTip();
        fashionTip1.setId(1L);
        FashionTip fashionTip2 = new FashionTip();
        fashionTip2.setId(fashionTip1.getId());
        assertThat(fashionTip1).isEqualTo(fashionTip2);
        fashionTip2.setId(2L);
        assertThat(fashionTip1).isNotEqualTo(fashionTip2);
        fashionTip1.setId(null);
        assertThat(fashionTip1).isNotEqualTo(fashionTip2);
    }
}
