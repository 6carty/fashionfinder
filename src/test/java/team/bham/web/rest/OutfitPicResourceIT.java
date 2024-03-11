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
import team.bham.domain.OutfitPic;
import team.bham.repository.OutfitPicRepository;

/**
 * Integration tests for the {@link OutfitPicResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OutfitPicResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/outfit-pics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OutfitPicRepository outfitPicRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOutfitPicMockMvc;

    private OutfitPic outfitPic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OutfitPic createEntity(EntityManager em) {
        OutfitPic outfitPic = new OutfitPic().image(DEFAULT_IMAGE).imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return outfitPic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OutfitPic createUpdatedEntity(EntityManager em) {
        OutfitPic outfitPic = new OutfitPic().image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return outfitPic;
    }

    @BeforeEach
    public void initTest() {
        outfitPic = createEntity(em);
    }

    @Test
    @Transactional
    void createOutfitPic() throws Exception {
        int databaseSizeBeforeCreate = outfitPicRepository.findAll().size();
        // Create the OutfitPic
        restOutfitPicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfitPic)))
            .andExpect(status().isCreated());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeCreate + 1);
        OutfitPic testOutfitPic = outfitPicList.get(outfitPicList.size() - 1);
        assertThat(testOutfitPic.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testOutfitPic.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createOutfitPicWithExistingId() throws Exception {
        // Create the OutfitPic with an existing ID
        outfitPic.setId(1L);

        int databaseSizeBeforeCreate = outfitPicRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOutfitPicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfitPic)))
            .andExpect(status().isBadRequest());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOutfitPics() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        // Get all the outfitPicList
        restOutfitPicMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(outfitPic.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getOutfitPic() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        // Get the outfitPic
        restOutfitPicMockMvc
            .perform(get(ENTITY_API_URL_ID, outfitPic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(outfitPic.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingOutfitPic() throws Exception {
        // Get the outfitPic
        restOutfitPicMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOutfitPic() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();

        // Update the outfitPic
        OutfitPic updatedOutfitPic = outfitPicRepository.findById(outfitPic.getId()).get();
        // Disconnect from session so that the updates on updatedOutfitPic are not directly saved in db
        em.detach(updatedOutfitPic);
        updatedOutfitPic.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restOutfitPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOutfitPic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOutfitPic))
            )
            .andExpect(status().isOk());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
        OutfitPic testOutfitPic = outfitPicList.get(outfitPicList.size() - 1);
        assertThat(testOutfitPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testOutfitPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, outfitPic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outfitPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(outfitPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(outfitPic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOutfitPicWithPatch() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();

        // Update the outfitPic using partial update
        OutfitPic partialUpdatedOutfitPic = new OutfitPic();
        partialUpdatedOutfitPic.setId(outfitPic.getId());

        partialUpdatedOutfitPic.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restOutfitPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutfitPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutfitPic))
            )
            .andExpect(status().isOk());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
        OutfitPic testOutfitPic = outfitPicList.get(outfitPicList.size() - 1);
        assertThat(testOutfitPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testOutfitPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateOutfitPicWithPatch() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();

        // Update the outfitPic using partial update
        OutfitPic partialUpdatedOutfitPic = new OutfitPic();
        partialUpdatedOutfitPic.setId(outfitPic.getId());

        partialUpdatedOutfitPic.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restOutfitPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOutfitPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOutfitPic))
            )
            .andExpect(status().isOk());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
        OutfitPic testOutfitPic = outfitPicList.get(outfitPicList.size() - 1);
        assertThat(testOutfitPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testOutfitPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, outfitPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outfitPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(outfitPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOutfitPic() throws Exception {
        int databaseSizeBeforeUpdate = outfitPicRepository.findAll().size();
        outfitPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOutfitPicMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(outfitPic))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OutfitPic in the database
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOutfitPic() throws Exception {
        // Initialize the database
        outfitPicRepository.saveAndFlush(outfitPic);

        int databaseSizeBeforeDelete = outfitPicRepository.findAll().size();

        // Delete the outfitPic
        restOutfitPicMockMvc
            .perform(delete(ENTITY_API_URL_ID, outfitPic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OutfitPic> outfitPicList = outfitPicRepository.findAll();
        assertThat(outfitPicList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
