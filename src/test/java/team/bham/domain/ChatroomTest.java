package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ChatroomTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chatroom.class);
        Chatroom chatroom1 = new Chatroom();
        chatroom1.setId(1L);
        Chatroom chatroom2 = new Chatroom();
        chatroom2.setId(chatroom1.getId());
        assertThat(chatroom1).isEqualTo(chatroom2);
        chatroom2.setId(2L);
        assertThat(chatroom1).isNotEqualTo(chatroom2);
        chatroom1.setId(null);
        assertThat(chatroom1).isNotEqualTo(chatroom2);
    }
}
