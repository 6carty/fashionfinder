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
import team.bham.IntegrationTest;
import team.bham.domain.MilestoneType;
import team.bham.repository.MilestoneTypeRepository;

/**
 * Integration tests for the {@link MilestoneTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MilestoneTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_INITIAL_TARGET = 1L;
    private static final Long UPDATED_INITIAL_TARGET = 2L;

    private static final Long DEFAULT_NEXT_TARGET = 1L;
    private static final Long UPDATED_NEXT_TARGET = 2L;

    private static final String ENTITY_API_URL = "/api/milestone-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MilestoneTypeRepository milestoneTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMilestoneTypeMockMvc;

    private MilestoneType milestoneType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MilestoneType createEntity(EntityManager em) {
        MilestoneType milestoneType = new MilestoneType()
            .name(DEFAULT_NAME)
            .initialTarget(DEFAULT_INITIAL_TARGET)
            .nextTarget(DEFAULT_NEXT_TARGET);
        return milestoneType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MilestoneType createUpdatedEntity(EntityManager em) {
        MilestoneType milestoneType = new MilestoneType()
            .name(UPDATED_NAME)
            .initialTarget(UPDATED_INITIAL_TARGET)
            .nextTarget(UPDATED_NEXT_TARGET);
        return milestoneType;
    }

    @BeforeEach
    public void initTest() {
        milestoneType = createEntity(em);
    }

    @Test
    @Transactional
    void createMilestoneType() throws Exception {
        int databaseSizeBeforeCreate = milestoneTypeRepository.findAll().size();
        // Create the MilestoneType
        restMilestoneTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestoneType)))
            .andExpect(status().isCreated());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeCreate + 1);
        MilestoneType testMilestoneType = milestoneTypeList.get(milestoneTypeList.size() - 1);
        assertThat(testMilestoneType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMilestoneType.getInitialTarget()).isEqualTo(DEFAULT_INITIAL_TARGET);
        assertThat(testMilestoneType.getNextTarget()).isEqualTo(DEFAULT_NEXT_TARGET);
    }

    @Test
    @Transactional
    void createMilestoneTypeWithExistingId() throws Exception {
        // Create the MilestoneType with an existing ID
        milestoneType.setId(1L);

        int databaseSizeBeforeCreate = milestoneTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMilestoneTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestoneType)))
            .andExpect(status().isBadRequest());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = milestoneTypeRepository.findAll().size();
        // set the field null
        milestoneType.setName(null);

        // Create the MilestoneType, which fails.

        restMilestoneTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestoneType)))
            .andExpect(status().isBadRequest());

        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInitialTargetIsRequired() throws Exception {
        int databaseSizeBeforeTest = milestoneTypeRepository.findAll().size();
        // set the field null
        milestoneType.setInitialTarget(null);

        // Create the MilestoneType, which fails.

        restMilestoneTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestoneType)))
            .andExpect(status().isBadRequest());

        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMilestoneTypes() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        // Get all the milestoneTypeList
        restMilestoneTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(milestoneType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].initialTarget").value(hasItem(DEFAULT_INITIAL_TARGET.intValue())))
            .andExpect(jsonPath("$.[*].nextTarget").value(hasItem(DEFAULT_NEXT_TARGET.intValue())));
    }

    @Test
    @Transactional
    void getMilestoneType() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        // Get the milestoneType
        restMilestoneTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, milestoneType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(milestoneType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.initialTarget").value(DEFAULT_INITIAL_TARGET.intValue()))
            .andExpect(jsonPath("$.nextTarget").value(DEFAULT_NEXT_TARGET.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMilestoneType() throws Exception {
        // Get the milestoneType
        restMilestoneTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMilestoneType() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();

        // Update the milestoneType
        MilestoneType updatedMilestoneType = milestoneTypeRepository.findById(milestoneType.getId()).get();
        // Disconnect from session so that the updates on updatedMilestoneType are not directly saved in db
        em.detach(updatedMilestoneType);
        updatedMilestoneType.name(UPDATED_NAME).initialTarget(UPDATED_INITIAL_TARGET).nextTarget(UPDATED_NEXT_TARGET);

        restMilestoneTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMilestoneType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMilestoneType))
            )
            .andExpect(status().isOk());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
        MilestoneType testMilestoneType = milestoneTypeList.get(milestoneTypeList.size() - 1);
        assertThat(testMilestoneType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMilestoneType.getInitialTarget()).isEqualTo(UPDATED_INITIAL_TARGET);
        assertThat(testMilestoneType.getNextTarget()).isEqualTo(UPDATED_NEXT_TARGET);
    }

    @Test
    @Transactional
    void putNonExistingMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, milestoneType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(milestoneType))
            )
            .andExpect(status().isBadRequest());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(milestoneType))
            )
            .andExpect(status().isBadRequest());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestoneType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMilestoneTypeWithPatch() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();

        // Update the milestoneType using partial update
        MilestoneType partialUpdatedMilestoneType = new MilestoneType();
        partialUpdatedMilestoneType.setId(milestoneType.getId());

        partialUpdatedMilestoneType.name(UPDATED_NAME).initialTarget(UPDATED_INITIAL_TARGET).nextTarget(UPDATED_NEXT_TARGET);

        restMilestoneTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMilestoneType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMilestoneType))
            )
            .andExpect(status().isOk());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
        MilestoneType testMilestoneType = milestoneTypeList.get(milestoneTypeList.size() - 1);
        assertThat(testMilestoneType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMilestoneType.getInitialTarget()).isEqualTo(UPDATED_INITIAL_TARGET);
        assertThat(testMilestoneType.getNextTarget()).isEqualTo(UPDATED_NEXT_TARGET);
    }

    @Test
    @Transactional
    void fullUpdateMilestoneTypeWithPatch() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();

        // Update the milestoneType using partial update
        MilestoneType partialUpdatedMilestoneType = new MilestoneType();
        partialUpdatedMilestoneType.setId(milestoneType.getId());

        partialUpdatedMilestoneType.name(UPDATED_NAME).initialTarget(UPDATED_INITIAL_TARGET).nextTarget(UPDATED_NEXT_TARGET);

        restMilestoneTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMilestoneType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMilestoneType))
            )
            .andExpect(status().isOk());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
        MilestoneType testMilestoneType = milestoneTypeList.get(milestoneTypeList.size() - 1);
        assertThat(testMilestoneType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMilestoneType.getInitialTarget()).isEqualTo(UPDATED_INITIAL_TARGET);
        assertThat(testMilestoneType.getNextTarget()).isEqualTo(UPDATED_NEXT_TARGET);
    }

    @Test
    @Transactional
    void patchNonExistingMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, milestoneType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(milestoneType))
            )
            .andExpect(status().isBadRequest());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(milestoneType))
            )
            .andExpect(status().isBadRequest());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMilestoneType() throws Exception {
        int databaseSizeBeforeUpdate = milestoneTypeRepository.findAll().size();
        milestoneType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(milestoneType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MilestoneType in the database
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMilestoneType() throws Exception {
        // Initialize the database
        milestoneTypeRepository.saveAndFlush(milestoneType);

        int databaseSizeBeforeDelete = milestoneTypeRepository.findAll().size();

        // Delete the milestoneType
        restMilestoneTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, milestoneType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MilestoneType> milestoneTypeList = milestoneTypeRepository.findAll();
        assertThat(milestoneTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
