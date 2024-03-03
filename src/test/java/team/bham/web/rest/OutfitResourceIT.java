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
import team.bham.domain.Outfit;
import team.bham.domain.enumeration.Occasion;
import team.bham.repository.OutfitRepository;

/**
 * Integration tests for the {@link OutfitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OutfitResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Occasion DEFAULT_OCCASION = Occasion.FORMAL;
    private static final Occasion UPDATED_OCCASION = Occasion.BUSINESS;

    private static final String ENTITY_API_URL = "/api/outfits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OutfitRepository outfitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOutfitMockMvc;

    private Outfit outfit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Outfit createEntity(EntityManager em) {
        Outfit outfit = new Outfit().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).date(DEFAULT_DATE).occasion(DEFAULT_OCCASION);
        return outfit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Outfit createUpdatedEntity(EntityManager em) {
        Outfit outfit = new Outfit().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).occasion(UPDATED_OCCASION);
        return outfit;
    }

    @BeforeEach
    public void initTest() {
        outfit = createEntity(em);
    }

    @Test
    @Transactional
    void createOutfit() throws Exception {
        int databaseSizeBeforeCreate = outfitRepository.findAll().size();
        // Create the Outfit
        restOutfitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isCreated());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeCreate + 1);
        Outfit testOutfit = outfitList.get(outfitList.size() - 1);
        assertThat(testOutfit.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOutfit.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOutfit.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOutfit.getOccasion()).isEqualTo(DEFAULT_OCCASION);
    }

    @Test
    @Transactional
    void createOutfitWithExistingId() throws Exception {
        // Create the Outfit with an existing ID
        outfit.setId(1L);

        int databaseSizeBeforeCreate = outfitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOutfitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isBadRequest());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = outfitRepository.findAll().size();
        // set the field null
        outfit.setName(null);

        // Create the Outfit, which fails.

        restOutfitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isBadRequest());

        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOccasionIsRequired() throws Exception {
        int databaseSizeBeforeTest = outfitRepository.findAll().size();
        // set the field null
        outfit.setOccasion(null);

        // Create the Outfit, which fails.

        restOutfitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isBadRequest());

        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOutfits() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        // Get all the outfitList
        restOutfitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(outfit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].occasion").value(hasItem(DEFAULT_OCCASION.toString())));
    }

    @Test
    @Transactional
    void getOutfit() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        // Get the outfit
        restOutfitMockMvc
            .perform(get(ENTITY_API_URL_ID, outfit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(outfit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.occasion").value(DEFAULT_OCCASION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOutfit() throws Exception {
        // Get the outfit
        restOutfitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOutfit() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();

        // Update the outfit
        Outfit updatedOutfit = outfitRepository.findById(outfit.getId()).get();
        // Disconnect from session so that the updates on updatedOutfit are not directly saved in db
        em.detach(updatedOutfit);
        updatedOutfit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).occasion(UPDATED_OCCASION);

        restOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOutfit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOutfit))
            )
            .andExpect(status().isOk());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
        Outfit testOutfit = outfitList.get(outfitList.size() - 1);
        assertThat(testOutfit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutfit.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutfit.getOccasion()).isEqualTo(UPDATED_OCCASION);
    }

    @Test
    @Transactional
    void putNonExistingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, outfit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOutfitWithPatch() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();

        // Update the outfit using partial update
        Outfit partialUpdatedOutfit = new Outfit();
        partialUpdatedOutfit.setId(outfit.getId());

        partialUpdatedOutfit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).occasion(UPDATED_OCCASION);

        restOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutfit))
            )
            .andExpect(status().isOk());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
        Outfit testOutfit = outfitList.get(outfitList.size() - 1);
        assertThat(testOutfit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutfit.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutfit.getOccasion()).isEqualTo(UPDATED_OCCASION);
    }

    @Test
    @Transactional
    void fullUpdateOutfitWithPatch() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();

        // Update the outfit using partial update
        Outfit partialUpdatedOutfit = new Outfit();
        partialUpdatedOutfit.setId(outfit.getId());

        partialUpdatedOutfit.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).date(UPDATED_DATE).occasion(UPDATED_OCCASION);

        restOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutfit))
            )
            .andExpect(status().isOk());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
        Outfit testOutfit = outfitList.get(outfitList.size() - 1);
        assertThat(testOutfit.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOutfit.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOutfit.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOutfit.getOccasion()).isEqualTo(UPDATED_OCCASION);
    }

    @Test
    @Transactional
    void patchNonExistingOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, outfit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outfit))
            )
            .andExpect(status().isBadRequest());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOutfit() throws Exception {
        int databaseSizeBeforeUpdate = outfitRepository.findAll().size();
        outfit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(outfit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Outfit in the database
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOutfit() throws Exception {
        // Initialize the database
        outfitRepository.saveAndFlush(outfit);

        int databaseSizeBeforeDelete = outfitRepository.findAll().size();

        // Delete the outfit
        restOutfitMockMvc
            .perform(delete(ENTITY_API_URL_ID, outfit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Outfit> outfitList = outfitRepository.findAll();
        assertThat(outfitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
