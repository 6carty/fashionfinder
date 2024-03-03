package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import team.bham.IntegrationTest;
import team.bham.domain.UserMilestone;
import team.bham.repository.UserMilestoneRepository;

/**
 * Integration tests for the {@link UserMilestoneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserMilestoneResourceIT {

    private static final Long DEFAULT_CURRENT_PROGRESS = 1L;
    private static final Long UPDATED_CURRENT_PROGRESS = 2L;

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final Instant DEFAULT_UNLOCKED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UNLOCKED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/user-milestones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserMilestoneRepository userMilestoneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserMilestoneMockMvc;

    private UserMilestone userMilestone;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMilestone createEntity(EntityManager em) {
        UserMilestone userMilestone = new UserMilestone()
            .currentProgress(DEFAULT_CURRENT_PROGRESS)
            .completed(DEFAULT_COMPLETED)
            .unlockedDate(DEFAULT_UNLOCKED_DATE);
        return userMilestone;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserMilestone createUpdatedEntity(EntityManager em) {
        UserMilestone userMilestone = new UserMilestone()
            .currentProgress(UPDATED_CURRENT_PROGRESS)
            .completed(UPDATED_COMPLETED)
            .unlockedDate(UPDATED_UNLOCKED_DATE);
        return userMilestone;
    }

    @BeforeEach
    public void initTest() {
        userMilestone = createEntity(em);
    }

    @Test
    @Transactional
    void createUserMilestone() throws Exception {
        int databaseSizeBeforeCreate = userMilestoneRepository.findAll().size();
        // Create the UserMilestone
        restUserMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMilestone)))
            .andExpect(status().isCreated());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeCreate + 1);
        UserMilestone testUserMilestone = userMilestoneList.get(userMilestoneList.size() - 1);
        assertThat(testUserMilestone.getCurrentProgress()).isEqualTo(DEFAULT_CURRENT_PROGRESS);
        assertThat(testUserMilestone.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testUserMilestone.getUnlockedDate()).isEqualTo(DEFAULT_UNLOCKED_DATE);
    }

    @Test
    @Transactional
    void createUserMilestoneWithExistingId() throws Exception {
        // Create the UserMilestone with an existing ID
        userMilestone.setId(1L);

        int databaseSizeBeforeCreate = userMilestoneRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMilestone)))
            .andExpect(status().isBadRequest());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCurrentProgressIsRequired() throws Exception {
        int databaseSizeBeforeTest = userMilestoneRepository.findAll().size();
        // set the field null
        userMilestone.setCurrentProgress(null);

        // Create the UserMilestone, which fails.

        restUserMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMilestone)))
            .andExpect(status().isBadRequest());

        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCompletedIsRequired() throws Exception {
        int databaseSizeBeforeTest = userMilestoneRepository.findAll().size();
        // set the field null
        userMilestone.setCompleted(null);

        // Create the UserMilestone, which fails.

        restUserMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMilestone)))
            .andExpect(status().isBadRequest());

        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserMilestones() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        // Get all the userMilestoneList
        restUserMilestoneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userMilestone.getId().intValue())))
            .andExpect(jsonPath("$.[*].currentProgress").value(hasItem(DEFAULT_CURRENT_PROGRESS.intValue())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())))
            .andExpect(jsonPath("$.[*].unlockedDate").value(hasItem(DEFAULT_UNLOCKED_DATE.toString())));
    }

    @Test
    @Transactional
    void getUserMilestone() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        // Get the userMilestone
        restUserMilestoneMockMvc
            .perform(get(ENTITY_API_URL_ID, userMilestone.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userMilestone.getId().intValue()))
            .andExpect(jsonPath("$.currentProgress").value(DEFAULT_CURRENT_PROGRESS.intValue()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()))
            .andExpect(jsonPath("$.unlockedDate").value(DEFAULT_UNLOCKED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserMilestone() throws Exception {
        // Get the userMilestone
        restUserMilestoneMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserMilestone() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();

        // Update the userMilestone
        UserMilestone updatedUserMilestone = userMilestoneRepository.findById(userMilestone.getId()).get();
        // Disconnect from session so that the updates on updatedUserMilestone are not directly saved in db
        em.detach(updatedUserMilestone);
        updatedUserMilestone.currentProgress(UPDATED_CURRENT_PROGRESS).completed(UPDATED_COMPLETED).unlockedDate(UPDATED_UNLOCKED_DATE);

        restUserMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserMilestone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserMilestone))
            )
            .andExpect(status().isOk());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
        UserMilestone testUserMilestone = userMilestoneList.get(userMilestoneList.size() - 1);
        assertThat(testUserMilestone.getCurrentProgress()).isEqualTo(UPDATED_CURRENT_PROGRESS);
        assertThat(testUserMilestone.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testUserMilestone.getUnlockedDate()).isEqualTo(UPDATED_UNLOCKED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userMilestone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMilestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userMilestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userMilestone)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserMilestoneWithPatch() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();

        // Update the userMilestone using partial update
        UserMilestone partialUpdatedUserMilestone = new UserMilestone();
        partialUpdatedUserMilestone.setId(userMilestone.getId());

        partialUpdatedUserMilestone.currentProgress(UPDATED_CURRENT_PROGRESS).unlockedDate(UPDATED_UNLOCKED_DATE);

        restUserMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMilestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMilestone))
            )
            .andExpect(status().isOk());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
        UserMilestone testUserMilestone = userMilestoneList.get(userMilestoneList.size() - 1);
        assertThat(testUserMilestone.getCurrentProgress()).isEqualTo(UPDATED_CURRENT_PROGRESS);
        assertThat(testUserMilestone.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
        assertThat(testUserMilestone.getUnlockedDate()).isEqualTo(UPDATED_UNLOCKED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateUserMilestoneWithPatch() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();

        // Update the userMilestone using partial update
        UserMilestone partialUpdatedUserMilestone = new UserMilestone();
        partialUpdatedUserMilestone.setId(userMilestone.getId());

        partialUpdatedUserMilestone
            .currentProgress(UPDATED_CURRENT_PROGRESS)
            .completed(UPDATED_COMPLETED)
            .unlockedDate(UPDATED_UNLOCKED_DATE);

        restUserMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserMilestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserMilestone))
            )
            .andExpect(status().isOk());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
        UserMilestone testUserMilestone = userMilestoneList.get(userMilestoneList.size() - 1);
        assertThat(testUserMilestone.getCurrentProgress()).isEqualTo(UPDATED_CURRENT_PROGRESS);
        assertThat(testUserMilestone.getCompleted()).isEqualTo(UPDATED_COMPLETED);
        assertThat(testUserMilestone.getUnlockedDate()).isEqualTo(UPDATED_UNLOCKED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userMilestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMilestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userMilestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserMilestone() throws Exception {
        int databaseSizeBeforeUpdate = userMilestoneRepository.findAll().size();
        userMilestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userMilestone))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserMilestone in the database
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserMilestone() throws Exception {
        // Initialize the database
        userMilestoneRepository.saveAndFlush(userMilestone);

        int databaseSizeBeforeDelete = userMilestoneRepository.findAll().size();

        // Delete the userMilestone
        restUserMilestoneMockMvc
            .perform(delete(ENTITY_API_URL_ID, userMilestone.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserMilestone> userMilestoneList = userMilestoneRepository.findAll();
        assertThat(userMilestoneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
