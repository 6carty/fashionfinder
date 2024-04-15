package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Chatroom;

/**
 * Spring Data JPA repository for the Chatroom entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
    @Query("select chatroom from Chatroom chatroom where chatroom.creator.login = ?#{principal.username}")
    List<Chatroom> findByCreatorIsCurrentUser();

    @Query("select chatroom from Chatroom chatroom where chatroom.recipient.login = ?#{principal.username}")
    List<Chatroom> findByRecipientIsCurrentUser();

    @Query(
        "select chatroom from Chatroom chatroom where chatroom.creator.login = ?#{principal.username} or chatroom.recipient.login = ?#{principal.username}"
    )
    List<Chatroom> findByCurrentUserInvolved();

    List<Chatroom> findByCreatorIdOrRecipientId(Long creatorId, Long recipientId);
}
