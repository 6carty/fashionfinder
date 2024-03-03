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
import team.bham.domain.Leaderboard;
import team.bham.repository.LeaderboardRepository;

/**
 * Integration tests for the {@link LeaderboardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LeaderboardResourceIT {

    private static final byte[] DEFAULT_PROFILE_PIC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PIC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PIC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PIC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_USERS_NAME = "AAAAAAAAAA";
    private static final String UPDATED_USERS_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_LIKE_COUNT = 1;
    private static final Integer UPDATED_LIKE_COUNT = 2;

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final String ENTITY_API_URL = "/api/leaderboards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeaderboardMockMvc;

    private Leaderboard leaderboard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Leaderboard createEntity(EntityManager em) {
        Leaderboard leaderboard = new Leaderboard()
            .profilePic(DEFAULT_PROFILE_PIC)
            .profilePicContentType(DEFAULT_PROFILE_PIC_CONTENT_TYPE)
            .usersName(DEFAULT_USERS_NAME)
            .likeCount(DEFAULT_LIKE_COUNT)
            .position(DEFAULT_POSITION);
        return leaderboard;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Leaderboard createUpdatedEntity(EntityManager em) {
        Leaderboard leaderboard = new Leaderboard()
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .usersName(UPDATED_USERS_NAME)
            .likeCount(UPDATED_LIKE_COUNT)
            .position(UPDATED_POSITION);
        return leaderboard;
    }

    @BeforeEach
    public void initTest() {
        leaderboard = createEntity(em);
    }

    @Test
    @Transactional
    void createLeaderboard() throws Exception {
        int databaseSizeBeforeCreate = leaderboardRepository.findAll().size();
        // Create the Leaderboard
        restLeaderboardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderboard)))
            .andExpect(status().isCreated());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeCreate + 1);
        Leaderboard testLeaderboard = leaderboardList.get(leaderboardList.size() - 1);
        assertThat(testLeaderboard.getProfilePic()).isEqualTo(DEFAULT_PROFILE_PIC);
        assertThat(testLeaderboard.getProfilePicContentType()).isEqualTo(DEFAULT_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testLeaderboard.getUsersName()).isEqualTo(DEFAULT_USERS_NAME);
        assertThat(testLeaderboard.getLikeCount()).isEqualTo(DEFAULT_LIKE_COUNT);
        assertThat(testLeaderboard.getPosition()).isEqualTo(DEFAULT_POSITION);
    }

    @Test
    @Transactional
    void createLeaderboardWithExistingId() throws Exception {
        // Create the Leaderboard with an existing ID
        leaderboard.setId(1L);

        int databaseSizeBeforeCreate = leaderboardRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaderboardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderboard)))
            .andExpect(status().isBadRequest());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLeaderboards() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        // Get all the leaderboardList
        restLeaderboardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaderboard.getId().intValue())))
            .andExpect(jsonPath("$.[*].profilePicContentType").value(hasItem(DEFAULT_PROFILE_PIC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePic").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PIC))))
            .andExpect(jsonPath("$.[*].usersName").value(hasItem(DEFAULT_USERS_NAME)))
            .andExpect(jsonPath("$.[*].likeCount").value(hasItem(DEFAULT_LIKE_COUNT)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)));
    }

    @Test
    @Transactional
    void getLeaderboard() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        // Get the leaderboard
        restLeaderboardMockMvc
            .perform(get(ENTITY_API_URL_ID, leaderboard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leaderboard.getId().intValue()))
            .andExpect(jsonPath("$.profilePicContentType").value(DEFAULT_PROFILE_PIC_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePic").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PIC)))
            .andExpect(jsonPath("$.usersName").value(DEFAULT_USERS_NAME))
            .andExpect(jsonPath("$.likeCount").value(DEFAULT_LIKE_COUNT))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION));
    }

    @Test
    @Transactional
    void getNonExistingLeaderboard() throws Exception {
        // Get the leaderboard
        restLeaderboardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLeaderboard() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();

        // Update the leaderboard
        Leaderboard updatedLeaderboard = leaderboardRepository.findById(leaderboard.getId()).get();
        // Disconnect from session so that the updates on updatedLeaderboard are not directly saved in db
        em.detach(updatedLeaderboard);
        updatedLeaderboard
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .usersName(UPDATED_USERS_NAME)
            .likeCount(UPDATED_LIKE_COUNT)
            .position(UPDATED_POSITION);

        restLeaderboardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLeaderboard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLeaderboard))
            )
            .andExpect(status().isOk());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
        Leaderboard testLeaderboard = leaderboardList.get(leaderboardList.size() - 1);
        assertThat(testLeaderboard.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testLeaderboard.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testLeaderboard.getUsersName()).isEqualTo(UPDATED_USERS_NAME);
        assertThat(testLeaderboard.getLikeCount()).isEqualTo(UPDATED_LIKE_COUNT);
        assertThat(testLeaderboard.getPosition()).isEqualTo(UPDATED_POSITION);
    }

    @Test
    @Transactional
    void putNonExistingLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leaderboard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderboard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaderboard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaderboard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeaderboardWithPatch() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();

        // Update the leaderboard using partial update
        Leaderboard partialUpdatedLeaderboard = new Leaderboard();
        partialUpdatedLeaderboard.setId(leaderboard.getId());

        partialUpdatedLeaderboard
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .usersName(UPDATED_USERS_NAME)
            .likeCount(UPDATED_LIKE_COUNT)
            .position(UPDATED_POSITION);

        restLeaderboardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaderboard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaderboard))
            )
            .andExpect(status().isOk());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
        Leaderboard testLeaderboard = leaderboardList.get(leaderboardList.size() - 1);
        assertThat(testLeaderboard.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testLeaderboard.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testLeaderboard.getUsersName()).isEqualTo(UPDATED_USERS_NAME);
        assertThat(testLeaderboard.getLikeCount()).isEqualTo(UPDATED_LIKE_COUNT);
        assertThat(testLeaderboard.getPosition()).isEqualTo(UPDATED_POSITION);
    }

    @Test
    @Transactional
    void fullUpdateLeaderboardWithPatch() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();

        // Update the leaderboard using partial update
        Leaderboard partialUpdatedLeaderboard = new Leaderboard();
        partialUpdatedLeaderboard.setId(leaderboard.getId());

        partialUpdatedLeaderboard
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .usersName(UPDATED_USERS_NAME)
            .likeCount(UPDATED_LIKE_COUNT)
            .position(UPDATED_POSITION);

        restLeaderboardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaderboard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaderboard))
            )
            .andExpect(status().isOk());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
        Leaderboard testLeaderboard = leaderboardList.get(leaderboardList.size() - 1);
        assertThat(testLeaderboard.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testLeaderboard.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testLeaderboard.getUsersName()).isEqualTo(UPDATED_USERS_NAME);
        assertThat(testLeaderboard.getLikeCount()).isEqualTo(UPDATED_LIKE_COUNT);
        assertThat(testLeaderboard.getPosition()).isEqualTo(UPDATED_POSITION);
    }

    @Test
    @Transactional
    void patchNonExistingLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leaderboard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderboard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaderboard))
            )
            .andExpect(status().isBadRequest());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeaderboard() throws Exception {
        int databaseSizeBeforeUpdate = leaderboardRepository.findAll().size();
        leaderboard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaderboardMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leaderboard))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Leaderboard in the database
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeaderboard() throws Exception {
        // Initialize the database
        leaderboardRepository.saveAndFlush(leaderboard);

        int databaseSizeBeforeDelete = leaderboardRepository.findAll().size();

        // Delete the leaderboard
        restLeaderboardMockMvc
            .perform(delete(ENTITY_API_URL_ID, leaderboard.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Leaderboard> leaderboardList = leaderboardRepository.findAll();
        assertThat(leaderboardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
