package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class WeatherTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Weather.class);
        Weather weather1 = new Weather();
        weather1.setId(1L);
        Weather weather2 = new Weather();
        weather2.setId(weather1.getId());
        assertThat(weather1).isEqualTo(weather2);
        weather2.setId(2L);
        assertThat(weather1).isNotEqualTo(weather2);
        weather1.setId(null);
        assertThat(weather1).isNotEqualTo(weather2);
    }
}
