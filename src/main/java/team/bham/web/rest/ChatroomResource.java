package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Chatroom;
import team.bham.repository.ChatroomRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Chatroom}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChatroomResource {

    private final Logger log = LoggerFactory.getLogger(ChatroomResource.class);

    private static final String ENTITY_NAME = "chatroom";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChatroomRepository chatroomRepository;

    public ChatroomResource(ChatroomRepository chatroomRepository) {
        this.chatroomRepository = chatroomRepository;
    }

    /**
     * {@code POST  /chatrooms} : Create a new chatroom.
     *
     * @param chatroom the chatroom to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chatroom, or with status {@code 400 (Bad Request)} if the chatroom has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chatrooms")
    public ResponseEntity<Chatroom> createChatroom(@Valid @RequestBody Chatroom chatroom) throws URISyntaxException {
        log.debug("REST request to save Chatroom : {}", chatroom);
        if (chatroom.getId() != null) {
            throw new BadRequestAlertException("A new chatroom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chatroom result = chatroomRepository.save(chatroom);
        return ResponseEntity
            .created(new URI("/api/chatrooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chatrooms/:id} : Updates an existing chatroom.
     *
     * @param id the id of the chatroom to save.
     * @param chatroom the chatroom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatroom,
     * or with status {@code 400 (Bad Request)} if the chatroom is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chatroom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chatrooms/{id}")
    public ResponseEntity<Chatroom> updateChatroom(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Chatroom chatroom
    ) throws URISyntaxException {
        log.debug("REST request to update Chatroom : {}, {}", id, chatroom);
        if (chatroom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatroom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatroomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chatroom result = chatroomRepository.save(chatroom);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chatroom.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chatrooms/:id} : Partial updates given fields of an existing chatroom, field will ignore if it is null
     *
     * @param id the id of the chatroom to save.
     * @param chatroom the chatroom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatroom,
     * or with status {@code 400 (Bad Request)} if the chatroom is not valid,
     * or with status {@code 404 (Not Found)} if the chatroom is not found,
     * or with status {@code 500 (Internal Server Error)} if the chatroom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chatrooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chatroom> partialUpdateChatroom(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Chatroom chatroom
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chatroom partially : {}, {}", id, chatroom);
        if (chatroom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatroom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatroomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chatroom> result = chatroomRepository
            .findById(chatroom.getId())
            .map(existingChatroom -> {
                if (chatroom.getName() != null) {
                    existingChatroom.setName(chatroom.getName());
                }

                return existingChatroom;
            })
            .map(chatroomRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chatroom.getId().toString())
        );
    }

    /**
     * {@code GET  /chatrooms} : get all the chatrooms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatrooms in body.
     */
    @GetMapping("/chatrooms")
    public List<Chatroom> getAllChatrooms() {
        log.debug("REST request to get all Chatrooms");
        return chatroomRepository.findAll();
    }

    /**
     * {@code GET  /chatrooms/:id} : get the "id" chatroom.
     *
     * @param id the id of the chatroom to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chatroom, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chatrooms/{id}")
    public ResponseEntity<Chatroom> getChatroom(@PathVariable Long id) {
        log.debug("REST request to get Chatroom : {}", id);
        Optional<Chatroom> chatroom = chatroomRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chatroom);
    }

    /**
     * {@code DELETE  /chatrooms/:id} : delete the "id" chatroom.
     *
     * @param id the id of the chatroom to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chatrooms/{id}")
    public ResponseEntity<Void> deleteChatroom(@PathVariable Long id) {
        log.debug("REST request to delete Chatroom : {}", id);
        chatroomRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
