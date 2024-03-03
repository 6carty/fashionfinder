package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class LikesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Likes.class);
        Likes likes1 = new Likes();
        likes1.setId(1L);
        Likes likes2 = new Likes();
        likes2.setId(likes1.getId());
        assertThat(likes1).isEqualTo(likes2);
        likes2.setId(2L);
        assertThat(likes1).isNotEqualTo(likes2);
        likes1.setId(null);
        assertThat(likes1).isNotEqualTo(likes2);
    }
}
