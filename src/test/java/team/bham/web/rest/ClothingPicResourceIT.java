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
import team.bham.domain.ClothingPic;
import team.bham.repository.ClothingPicRepository;

/**
 * Integration tests for the {@link ClothingPicResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClothingPicResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/clothing-pics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClothingPicRepository clothingPicRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClothingPicMockMvc;

    private ClothingPic clothingPic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClothingPic createEntity(EntityManager em) {
        ClothingPic clothingPic = new ClothingPic().image(DEFAULT_IMAGE).imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return clothingPic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClothingPic createUpdatedEntity(EntityManager em) {
        ClothingPic clothingPic = new ClothingPic().image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return clothingPic;
    }

    @BeforeEach
    public void initTest() {
        clothingPic = createEntity(em);
    }

    @Test
    @Transactional
    void createClothingPic() throws Exception {
        int databaseSizeBeforeCreate = clothingPicRepository.findAll().size();
        // Create the ClothingPic
        restClothingPicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingPic)))
            .andExpect(status().isCreated());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeCreate + 1);
        ClothingPic testClothingPic = clothingPicList.get(clothingPicList.size() - 1);
        assertThat(testClothingPic.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testClothingPic.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createClothingPicWithExistingId() throws Exception {
        // Create the ClothingPic with an existing ID
        clothingPic.setId(1L);

        int databaseSizeBeforeCreate = clothingPicRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClothingPicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingPic)))
            .andExpect(status().isBadRequest());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClothingPics() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        // Get all the clothingPicList
        restClothingPicMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clothingPic.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getClothingPic() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        // Get the clothingPic
        restClothingPicMockMvc
            .perform(get(ENTITY_API_URL_ID, clothingPic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clothingPic.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingClothingPic() throws Exception {
        // Get the clothingPic
        restClothingPicMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClothingPic() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();

        // Update the clothingPic
        ClothingPic updatedClothingPic = clothingPicRepository.findById(clothingPic.getId()).get();
        // Disconnect from session so that the updates on updatedClothingPic are not directly saved in db
        em.detach(updatedClothingPic);
        updatedClothingPic.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restClothingPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClothingPic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClothingPic))
            )
            .andExpect(status().isOk());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
        ClothingPic testClothingPic = clothingPicList.get(clothingPicList.size() - 1);
        assertThat(testClothingPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testClothingPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clothingPic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clothingPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clothingPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingPic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClothingPicWithPatch() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();

        // Update the clothingPic using partial update
        ClothingPic partialUpdatedClothingPic = new ClothingPic();
        partialUpdatedClothingPic.setId(clothingPic.getId());

        restClothingPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothingPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClothingPic))
            )
            .andExpect(status().isOk());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
        ClothingPic testClothingPic = clothingPicList.get(clothingPicList.size() - 1);
        assertThat(testClothingPic.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testClothingPic.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateClothingPicWithPatch() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();

        // Update the clothingPic using partial update
        ClothingPic partialUpdatedClothingPic = new ClothingPic();
        partialUpdatedClothingPic.setId(clothingPic.getId());

        partialUpdatedClothingPic.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restClothingPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothingPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClothingPic))
            )
            .andExpect(status().isOk());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
        ClothingPic testClothingPic = clothingPicList.get(clothingPicList.size() - 1);
        assertThat(testClothingPic.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testClothingPic.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clothingPic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clothingPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clothingPic))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClothingPic() throws Exception {
        int databaseSizeBeforeUpdate = clothingPicRepository.findAll().size();
        clothingPic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingPicMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clothingPic))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClothingPic in the database
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClothingPic() throws Exception {
        // Initialize the database
        clothingPicRepository.saveAndFlush(clothingPic);

        int databaseSizeBeforeDelete = clothingPicRepository.findAll().size();

        // Delete the clothingPic
        restClothingPicMockMvc
            .perform(delete(ENTITY_API_URL_ID, clothingPic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClothingPic> clothingPicList = clothingPicRepository.findAll();
        assertThat(clothingPicList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
