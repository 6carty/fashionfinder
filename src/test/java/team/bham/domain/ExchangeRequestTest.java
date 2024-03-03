package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ExchangeRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExchangeRequest.class);
        ExchangeRequest exchangeRequest1 = new ExchangeRequest();
        exchangeRequest1.setId(1L);
        ExchangeRequest exchangeRequest2 = new ExchangeRequest();
        exchangeRequest2.setId(exchangeRequest1.getId());
        assertThat(exchangeRequest1).isEqualTo(exchangeRequest2);
        exchangeRequest2.setId(2L);
        assertThat(exchangeRequest1).isNotEqualTo(exchangeRequest2);
        exchangeRequest1.setId(null);
        assertThat(exchangeRequest1).isNotEqualTo(exchangeRequest2);
    }
}
