package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class UserMilestoneTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserMilestone.class);
        UserMilestone userMilestone1 = new UserMilestone();
        userMilestone1.setId(1L);
        UserMilestone userMilestone2 = new UserMilestone();
        userMilestone2.setId(userMilestone1.getId());
        assertThat(userMilestone1).isEqualTo(userMilestone2);
        userMilestone2.setId(2L);
        assertThat(userMilestone1).isNotEqualTo(userMilestone2);
        userMilestone1.setId(null);
        assertThat(userMilestone1).isNotEqualTo(userMilestone2);
    }
}
