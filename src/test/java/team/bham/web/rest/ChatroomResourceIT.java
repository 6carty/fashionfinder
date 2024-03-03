package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Chatroom;
import team.bham.repository.ChatroomRepository;

/**
 * Integration tests for the {@link ChatroomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChatroomResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_ICON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ICON = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ICON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ICON_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/chatrooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChatroomRepository chatroomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChatroomMockMvc;

    private Chatroom chatroom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chatroom createEntity(EntityManager em) {
        Chatroom chatroom = new Chatroom().name(DEFAULT_NAME).icon(DEFAULT_ICON).iconContentType(DEFAULT_ICON_CONTENT_TYPE);
        return chatroom;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chatroom createUpdatedEntity(EntityManager em) {
        Chatroom chatroom = new Chatroom().name(UPDATED_NAME).icon(UPDATED_ICON).iconContentType(UPDATED_ICON_CONTENT_TYPE);
        return chatroom;
    }

    @BeforeEach
    public void initTest() {
        chatroom = createEntity(em);
    }

    @Test
    @Transactional
    void createChatroom() throws Exception {
        int databaseSizeBeforeCreate = chatroomRepository.findAll().size();
        // Create the Chatroom
        restChatroomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatroom)))
            .andExpect(status().isCreated());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeCreate + 1);
        Chatroom testChatroom = chatroomList.get(chatroomList.size() - 1);
        assertThat(testChatroom.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChatroom.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testChatroom.getIconContentType()).isEqualTo(DEFAULT_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createChatroomWithExistingId() throws Exception {
        // Create the Chatroom with an existing ID
        chatroom.setId(1L);

        int databaseSizeBeforeCreate = chatroomRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatroomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatroom)))
            .andExpect(status().isBadRequest());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = chatroomRepository.findAll().size();
        // set the field null
        chatroom.setName(null);

        // Create the Chatroom, which fails.

        restChatroomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatroom)))
            .andExpect(status().isBadRequest());

        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChatrooms() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        // Get all the chatroomList
        restChatroomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatroom.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].iconContentType").value(hasItem(DEFAULT_ICON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(Base64Utils.encodeToString(DEFAULT_ICON))));
    }

    @Test
    @Transactional
    void getChatroom() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        // Get the chatroom
        restChatroomMockMvc
            .perform(get(ENTITY_API_URL_ID, chatroom.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chatroom.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.iconContentType").value(DEFAULT_ICON_CONTENT_TYPE))
            .andExpect(jsonPath("$.icon").value(Base64Utils.encodeToString(DEFAULT_ICON)));
    }

    @Test
    @Transactional
    void getNonExistingChatroom() throws Exception {
        // Get the chatroom
        restChatroomMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChatroom() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();

        // Update the chatroom
        Chatroom updatedChatroom = chatroomRepository.findById(chatroom.getId()).get();
        // Disconnect from session so that the updates on updatedChatroom are not directly saved in db
        em.detach(updatedChatroom);
        updatedChatroom.name(UPDATED_NAME).icon(UPDATED_ICON).iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restChatroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChatroom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChatroom))
            )
            .andExpect(status().isOk());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
        Chatroom testChatroom = chatroomList.get(chatroomList.size() - 1);
        assertThat(testChatroom.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChatroom.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testChatroom.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chatroom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chatroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chatroom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChatroomWithPatch() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();

        // Update the chatroom using partial update
        Chatroom partialUpdatedChatroom = new Chatroom();
        partialUpdatedChatroom.setId(chatroom.getId());

        partialUpdatedChatroom.icon(UPDATED_ICON).iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restChatroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatroom))
            )
            .andExpect(status().isOk());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
        Chatroom testChatroom = chatroomList.get(chatroomList.size() - 1);
        assertThat(testChatroom.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChatroom.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testChatroom.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateChatroomWithPatch() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();

        // Update the chatroom using partial update
        Chatroom partialUpdatedChatroom = new Chatroom();
        partialUpdatedChatroom.setId(chatroom.getId());

        partialUpdatedChatroom.name(UPDATED_NAME).icon(UPDATED_ICON).iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restChatroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChatroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChatroom))
            )
            .andExpect(status().isOk());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
        Chatroom testChatroom = chatroomList.get(chatroomList.size() - 1);
        assertThat(testChatroom.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChatroom.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testChatroom.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chatroom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chatroom))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChatroom() throws Exception {
        int databaseSizeBeforeUpdate = chatroomRepository.findAll().size();
        chatroom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChatroomMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chatroom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chatroom in the database
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChatroom() throws Exception {
        // Initialize the database
        chatroomRepository.saveAndFlush(chatroom);

        int databaseSizeBeforeDelete = chatroomRepository.findAll().size();

        // Delete the chatroom
        restChatroomMockMvc
            .perform(delete(ENTITY_API_URL_ID, chatroom.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chatroom> chatroomList = chatroomRepository.findAll();
        assertThat(chatroomList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
