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
import team.bham.domain.ChatMessage;
import team.bham.repository.ChatMessageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ChatMessage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChatMessageResource {

    private final Logger log = LoggerFactory.getLogger(ChatMessageResource.class);

    private static final String ENTITY_NAME = "chatMessage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageResource(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * {@code POST  /chat-messages} : Create a new chatMessage.
     *
     * @param chatMessage the chatMessage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chatMessage, or with status {@code 400 (Bad Request)} if the chatMessage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chat-messages")
    public ResponseEntity<ChatMessage> createChatMessage(@Valid @RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to save ChatMessage : {}", chatMessage);
        if (chatMessage.getId() != null) {
            throw new BadRequestAlertException("A new chatMessage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChatMessage result = chatMessageRepository.save(chatMessage);
        return ResponseEntity
            .created(new URI("/api/chat-messages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chat-messages/:id} : Updates an existing chatMessage.
     *
     * @param id the id of the chatMessage to save.
     * @param chatMessage the chatMessage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatMessage,
     * or with status {@code 400 (Bad Request)} if the chatMessage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chatMessage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chat-messages/{id}")
    public ResponseEntity<ChatMessage> updateChatMessage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChatMessage chatMessage
    ) throws URISyntaxException {
        log.debug("REST request to update ChatMessage : {}, {}", id, chatMessage);
        if (chatMessage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatMessage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatMessageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChatMessage result = chatMessageRepository.save(chatMessage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chatMessage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chat-messages/:id} : Partial updates given fields of an existing chatMessage, field will ignore if it is null
     *
     * @param id the id of the chatMessage to save.
     * @param chatMessage the chatMessage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatMessage,
     * or with status {@code 400 (Bad Request)} if the chatMessage is not valid,
     * or with status {@code 404 (Not Found)} if the chatMessage is not found,
     * or with status {@code 500 (Internal Server Error)} if the chatMessage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chat-messages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChatMessage> partialUpdateChatMessage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChatMessage chatMessage
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChatMessage partially : {}, {}", id, chatMessage);
        if (chatMessage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chatMessage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chatMessageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChatMessage> result = chatMessageRepository
            .findById(chatMessage.getId())
            .map(existingChatMessage -> {
                if (chatMessage.getContent() != null) {
                    existingChatMessage.setContent(chatMessage.getContent());
                }
                if (chatMessage.getTimestamp() != null) {
                    existingChatMessage.setTimestamp(chatMessage.getTimestamp());
                }
                if (chatMessage.getImage() != null) {
                    existingChatMessage.setImage(chatMessage.getImage());
                }
                if (chatMessage.getImageContentType() != null) {
                    existingChatMessage.setImageContentType(chatMessage.getImageContentType());
                }

                return existingChatMessage;
            })
            .map(chatMessageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chatMessage.getId().toString())
        );
    }

    /**
     * {@code GET  /chat-messages} : get all the chatMessages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatMessages in body.
     */
    @GetMapping("/chat-messages")
    public List<ChatMessage> getAllChatMessages() {
        log.debug("REST request to get all ChatMessages");
        return chatMessageRepository.findAll();
    }

    /**
     * {@code GET  /chat-messages/:id} : get the "id" chatMessage.
     *
     * @param id the id of the chatMessage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chatMessage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chat-messages/{id}")
    public ResponseEntity<ChatMessage> getChatMessage(@PathVariable Long id) {
        log.debug("REST request to get ChatMessage : {}", id);
        Optional<ChatMessage> chatMessage = chatMessageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chatMessage);
    }

    /**
     * {@code DELETE  /chat-messages/:id} : delete the "id" chatMessage.
     *
     * @param id the id of the chatMessage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chat-messages/{id}")
    public ResponseEntity<Void> deleteChatMessage(@PathVariable Long id) {
        log.debug("REST request to delete ChatMessage : {}", id);
        chatMessageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
