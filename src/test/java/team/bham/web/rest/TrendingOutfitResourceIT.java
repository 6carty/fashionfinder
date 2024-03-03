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
import team.bham.domain.TrendingOutfit;
import team.bham.repository.TrendingOutfitRepository;

/**
 * Integration tests for the {@link TrendingOutfitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrendingOutfitResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/trending-outfits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrendingOutfitRepository trendingOutfitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrendingOutfitMockMvc;

    private TrendingOutfit trendingOutfit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrendingOutfit createEntity(EntityManager em) {
        TrendingOutfit trendingOutfit = new TrendingOutfit().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return trendingOutfit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrendingOutfit createUpdatedEntity(EntityManager em) {
        TrendingOutfit trendingOutfit = new TrendingOutfit().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return trendingOutfit;
    }

    @BeforeEach
    public void initTest() {
        trendingOutfit = createEntity(em);
    }

    @Test
    @Transactional
    void createTrendingOutfit() throws Exception {
        int databaseSizeBeforeCreate = trendingOutfitRepository.findAll().size();
        // Create the TrendingOutfit
        restTrendingOutfitMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isCreated());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeCreate + 1);
        TrendingOutfit testTrendingOutfit = trendingOutfitList.get(trendingOutfitList.size() - 1);
        assertThat(testTrendingOutfit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTrendingOutfit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createTrendingOutfitWithExistingId() throws Exception {
        // Create the TrendingOutfit with an existing ID
        trendingOutfit.setId(1L);

        int databaseSizeBeforeCreate = trendingOutfitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrendingOutfitMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = trendingOutfitRepository.findAll().size();
        // set the field null
        trendingOutfit.setName(null);

        // Create the TrendingOutfit, which fails.

        restTrendingOutfitMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTrendingOutfits() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        // Get all the trendingOutfitList
        restTrendingOutfitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trendingOutfit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getTrendingOutfit() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        // Get the trendingOutfit
        restTrendingOutfitMockMvc
            .perform(get(ENTITY_API_URL_ID, trendingOutfit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trendingOutfit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingTrendingOutfit() throws Exception {
        // Get the trendingOutfit
        restTrendingOutfitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTrendingOutfit() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();

        // Update the trendingOutfit
        TrendingOutfit updatedTrendingOutfit = trendingOutfitRepository.findById(trendingOutfit.getId()).get();
        // Disconnect from session so that the updates on updatedTrendingOutfit are not directly saved in db
        em.detach(updatedTrendingOutfit);
        updatedTrendingOutfit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restTrendingOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrendingOutfit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrendingOutfit))
            )
            .andExpect(status().isOk());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
        TrendingOutfit testTrendingOutfit = trendingOutfitList.get(trendingOutfitList.size() - 1);
        assertThat(testTrendingOutfit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTrendingOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trendingOutfit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trendingOutfit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrendingOutfitWithPatch() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();

        // Update the trendingOutfit using partial update
        TrendingOutfit partialUpdatedTrendingOutfit = new TrendingOutfit();
        partialUpdatedTrendingOutfit.setId(trendingOutfit.getId());

        partialUpdatedTrendingOutfit.description(UPDATED_DESCRIPTION);

        restTrendingOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrendingOutfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrendingOutfit))
            )
            .andExpect(status().isOk());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
        TrendingOutfit testTrendingOutfit = trendingOutfitList.get(trendingOutfitList.size() - 1);
        assertThat(testTrendingOutfit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTrendingOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateTrendingOutfitWithPatch() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();

        // Update the trendingOutfit using partial update
        TrendingOutfit partialUpdatedTrendingOutfit = new TrendingOutfit();
        partialUpdatedTrendingOutfit.setId(trendingOutfit.getId());

        partialUpdatedTrendingOutfit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restTrendingOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrendingOutfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrendingOutfit))
            )
            .andExpect(status().isOk());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
        TrendingOutfit testTrendingOutfit = trendingOutfitList.get(trendingOutfitList.size() - 1);
        assertThat(testTrendingOutfit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTrendingOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trendingOutfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrendingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = trendingOutfitRepository.findAll().size();
        trendingOutfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrendingOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(trendingOutfit))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrendingOutfit in the database
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrendingOutfit() throws Exception {
        // Initialize the database
        trendingOutfitRepository.saveAndFlush(trendingOutfit);

        int databaseSizeBeforeDelete = trendingOutfitRepository.findAll().size();

        // Delete the trendingOutfit
        restTrendingOutfitMockMvc
            .perform(delete(ENTITY_API_URL_ID, trendingOutfit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TrendingOutfit> trendingOutfitList = trendingOutfitRepository.findAll();
        assertThat(trendingOutfitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
