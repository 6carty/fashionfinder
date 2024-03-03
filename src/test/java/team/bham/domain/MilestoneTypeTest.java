package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MilestoneTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MilestoneType.class);
        MilestoneType milestoneType1 = new MilestoneType();
        milestoneType1.setId(1L);
        MilestoneType milestoneType2 = new MilestoneType();
        milestoneType2.setId(milestoneType1.getId());
        assertThat(milestoneType1).isEqualTo(milestoneType2);
        milestoneType2.setId(2L);
        assertThat(milestoneType1).isNotEqualTo(milestoneType2);
        milestoneType1.setId(null);
        assertThat(milestoneType1).isNotEqualTo(milestoneType2);
    }
}
