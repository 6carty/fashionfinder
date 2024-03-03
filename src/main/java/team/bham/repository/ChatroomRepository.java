package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Chatroom;

/**
 * Spring Data JPA repository for the Chatroom entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {}
