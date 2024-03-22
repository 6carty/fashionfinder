package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ChatMessage;

/**
 * Spring Data JPA repository for the ChatMessage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("select chatMessage from ChatMessage chatMessage where chatMessage.sender.login = ?#{principal.username}")
    List<ChatMessage> findBySenderIsCurrentUser();
}
