package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItemLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemLog.class);
        ItemLog itemLog1 = new ItemLog();
        itemLog1.setId(1L);
        ItemLog itemLog2 = new ItemLog();
        itemLog2.setId(itemLog1.getId());
        assertThat(itemLog1).isEqualTo(itemLog2);
        itemLog2.setId(2L);
        assertThat(itemLog1).isNotEqualTo(itemLog2);
        itemLog1.setId(null);
        assertThat(itemLog1).isNotEqualTo(itemLog2);
    }
}
