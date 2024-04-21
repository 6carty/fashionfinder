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
import team.bham.domain.FashionTip;
import team.bham.repository.FashionTipRepository;

/**
 * Integration tests for the {@link FashionTipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FashionTipResourceIT {

    private static final String DEFAULT_TITLE_1 = "AAAAAAAAAA";
    private static final String UPDATED_TITLE_1 = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_1 = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_1 = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fashion-tips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FashionTipRepository fashionTipRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFashionTipMockMvc;

    private FashionTip fashionTip;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FashionTip createEntity(EntityManager em) {
        FashionTip fashionTip = new FashionTip().title1(DEFAULT_TITLE_1).description1(DEFAULT_DESCRIPTION_1);
        return fashionTip;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FashionTip createUpdatedEntity(EntityManager em) {
        FashionTip fashionTip = new FashionTip().title1(UPDATED_TITLE_1).description1(UPDATED_DESCRIPTION_1);
        return fashionTip;
    }

    @BeforeEach
    public void initTest() {
        fashionTip = createEntity(em);
    }

    @Test
    @Transactional
    void createFashionTip() throws Exception {
        int databaseSizeBeforeCreate = fashionTipRepository.findAll().size();
        // Create the FashionTip
        restFashionTipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fashionTip)))
            .andExpect(status().isCreated());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeCreate + 1);
        FashionTip testFashionTip = fashionTipList.get(fashionTipList.size() - 1);
        assertThat(testFashionTip.getTitle1()).isEqualTo(DEFAULT_TITLE_1);
        assertThat(testFashionTip.getDescription1()).isEqualTo(DEFAULT_DESCRIPTION_1);
    }

    @Test
    @Transactional
    void createFashionTipWithExistingId() throws Exception {
        // Create the FashionTip with an existing ID
        fashionTip.setId(1L);

        int databaseSizeBeforeCreate = fashionTipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFashionTipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fashionTip)))
            .andExpect(status().isBadRequest());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitle1IsRequired() throws Exception {
        int databaseSizeBeforeTest = fashionTipRepository.findAll().size();
        // set the field null
        fashionTip.setTitle1(null);

        // Create the FashionTip, which fails.

        restFashionTipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fashionTip)))
            .andExpect(status().isBadRequest());

        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFashionTips() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        // Get all the fashionTipList
        restFashionTipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fashionTip.getId().intValue())))
            .andExpect(jsonPath("$.[*].title1").value(hasItem(DEFAULT_TITLE_1)))
            .andExpect(jsonPath("$.[*].description1").value(hasItem(DEFAULT_DESCRIPTION_1)));
    }

    @Test
    @Transactional
    void getFashionTip() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        // Get the fashionTip
        restFashionTipMockMvc
            .perform(get(ENTITY_API_URL_ID, fashionTip.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fashionTip.getId().intValue()))
            .andExpect(jsonPath("$.title1").value(DEFAULT_TITLE_1))
            .andExpect(jsonPath("$.description1").value(DEFAULT_DESCRIPTION_1));
    }

    @Test
    @Transactional
    void getNonExistingFashionTip() throws Exception {
        // Get the fashionTip
        restFashionTipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFashionTip() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();

        // Update the fashionTip
        FashionTip updatedFashionTip = fashionTipRepository.findById(fashionTip.getId()).get();
        // Disconnect from session so that the updates on updatedFashionTip are not directly saved in db
        em.detach(updatedFashionTip);
        updatedFashionTip.title1(UPDATED_TITLE_1).description1(UPDATED_DESCRIPTION_1);

        restFashionTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFashionTip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFashionTip))
            )
            .andExpect(status().isOk());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
        FashionTip testFashionTip = fashionTipList.get(fashionTipList.size() - 1);
        assertThat(testFashionTip.getTitle1()).isEqualTo(UPDATED_TITLE_1);
        assertThat(testFashionTip.getDescription1()).isEqualTo(UPDATED_DESCRIPTION_1);
    }

    @Test
    @Transactional
    void putNonExistingFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fashionTip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fashionTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fashionTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fashionTip)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFashionTipWithPatch() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();

        // Update the fashionTip using partial update
        FashionTip partialUpdatedFashionTip = new FashionTip();
        partialUpdatedFashionTip.setId(fashionTip.getId());

        partialUpdatedFashionTip.title1(UPDATED_TITLE_1).description1(UPDATED_DESCRIPTION_1);

        restFashionTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFashionTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFashionTip))
            )
            .andExpect(status().isOk());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
        FashionTip testFashionTip = fashionTipList.get(fashionTipList.size() - 1);
        assertThat(testFashionTip.getTitle1()).isEqualTo(UPDATED_TITLE_1);
        assertThat(testFashionTip.getDescription1()).isEqualTo(UPDATED_DESCRIPTION_1);
    }

    @Test
    @Transactional
    void fullUpdateFashionTipWithPatch() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();

        // Update the fashionTip using partial update
        FashionTip partialUpdatedFashionTip = new FashionTip();
        partialUpdatedFashionTip.setId(fashionTip.getId());

        partialUpdatedFashionTip.title1(UPDATED_TITLE_1).description1(UPDATED_DESCRIPTION_1);

        restFashionTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFashionTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFashionTip))
            )
            .andExpect(status().isOk());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
        FashionTip testFashionTip = fashionTipList.get(fashionTipList.size() - 1);
        assertThat(testFashionTip.getTitle1()).isEqualTo(UPDATED_TITLE_1);
        assertThat(testFashionTip.getDescription1()).isEqualTo(UPDATED_DESCRIPTION_1);
    }

    @Test
    @Transactional
    void patchNonExistingFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fashionTip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fashionTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fashionTip))
            )
            .andExpect(status().isBadRequest());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFashionTip() throws Exception {
        int databaseSizeBeforeUpdate = fashionTipRepository.findAll().size();
        fashionTip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFashionTipMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fashionTip))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FashionTip in the database
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFashionTip() throws Exception {
        // Initialize the database
        fashionTipRepository.saveAndFlush(fashionTip);

        int databaseSizeBeforeDelete = fashionTipRepository.findAll().size();

        // Delete the fashionTip
        restFashionTipMockMvc
            .perform(delete(ENTITY_API_URL_ID, fashionTip.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FashionTip> fashionTipList = fashionTipRepository.findAll();
        assertThat(fashionTipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
