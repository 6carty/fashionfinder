package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PurchaseListingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PurchaseListing.class);
        PurchaseListing purchaseListing1 = new PurchaseListing();
        purchaseListing1.setId(1L);
        PurchaseListing purchaseListing2 = new PurchaseListing();
        purchaseListing2.setId(purchaseListing1.getId());
        assertThat(purchaseListing1).isEqualTo(purchaseListing2);
        purchaseListing2.setId(2L);
        assertThat(purchaseListing1).isNotEqualTo(purchaseListing2);
        purchaseListing1.setId(null);
        assertThat(purchaseListing1).isNotEqualTo(purchaseListing2);
    }
}
