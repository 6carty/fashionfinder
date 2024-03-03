package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SaleListingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SaleListing.class);
        SaleListing saleListing1 = new SaleListing();
        saleListing1.setId(1L);
        SaleListing saleListing2 = new SaleListing();
        saleListing2.setId(saleListing1.getId());
        assertThat(saleListing1).isEqualTo(saleListing2);
        saleListing2.setId(2L);
        assertThat(saleListing1).isNotEqualTo(saleListing2);
        saleListing1.setId(null);
        assertThat(saleListing1).isNotEqualTo(saleListing2);
    }
}
