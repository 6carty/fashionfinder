package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.ClothingItem;
import team.bham.domain.enumeration.ClothingType;
import team.bham.domain.enumeration.Status;
import team.bham.repository.ClothingItemRepository;

/**
 * Integration tests for the {@link ClothingItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ClothingItemResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ClothingType DEFAULT_TYPE = ClothingType.SHIRTS;
    private static final ClothingType UPDATED_TYPE = ClothingType.SHOES;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CLOTHING_SIZE = "AAAAAAAAAA";
    private static final String UPDATED_CLOTHING_SIZE = "BBBBBBBBBB";

    private static final String DEFAULT_COLOUR = "AAAAAAAAAA";
    private static final String UPDATED_COLOUR = "BBBBBBBBBB";

    private static final String DEFAULT_STYLE = "AAAAAAAAAA";
    private static final String UPDATED_STYLE = "BBBBBBBBBB";

    private static final String DEFAULT_BRAND = "AAAAAAAAAA";
    private static final String UPDATED_BRAND = "BBBBBBBBBB";

    private static final String DEFAULT_MATERIAL = "AAAAAAAAAA";
    private static final String UPDATED_MATERIAL = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.NOTFORSALE;
    private static final Status UPDATED_STATUS = Status.AVAILABLE;

    private static final Instant DEFAULT_LAST_WORN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_WORN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/clothing-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClothingItemRepository clothingItemRepository;

    @Mock
    private ClothingItemRepository clothingItemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClothingItemMockMvc;

    private ClothingItem clothingItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClothingItem createEntity(EntityManager em) {
        ClothingItem clothingItem = new ClothingItem()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .clothingSize(DEFAULT_CLOTHING_SIZE)
            .colour(DEFAULT_COLOUR)
            .style(DEFAULT_STYLE)
            .brand(DEFAULT_BRAND)
            .material(DEFAULT_MATERIAL)
            .status(DEFAULT_STATUS)
            .lastWorn(DEFAULT_LAST_WORN);
        return clothingItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClothingItem createUpdatedEntity(EntityManager em) {
        ClothingItem clothingItem = new ClothingItem()
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .clothingSize(UPDATED_CLOTHING_SIZE)
            .colour(UPDATED_COLOUR)
            .style(UPDATED_STYLE)
            .brand(UPDATED_BRAND)
            .material(UPDATED_MATERIAL)
            .status(UPDATED_STATUS)
            .lastWorn(UPDATED_LAST_WORN);
        return clothingItem;
    }

    @BeforeEach
    public void initTest() {
        clothingItem = createEntity(em);
    }

    @Test
    @Transactional
    void createClothingItem() throws Exception {
        int databaseSizeBeforeCreate = clothingItemRepository.findAll().size();
        // Create the ClothingItem
        restClothingItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isCreated());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeCreate + 1);
        ClothingItem testClothingItem = clothingItemList.get(clothingItemList.size() - 1);
        assertThat(testClothingItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testClothingItem.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testClothingItem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testClothingItem.getClothingSize()).isEqualTo(DEFAULT_CLOTHING_SIZE);
        assertThat(testClothingItem.getColour()).isEqualTo(DEFAULT_COLOUR);
        assertThat(testClothingItem.getStyle()).isEqualTo(DEFAULT_STYLE);
        assertThat(testClothingItem.getBrand()).isEqualTo(DEFAULT_BRAND);
        assertThat(testClothingItem.getMaterial()).isEqualTo(DEFAULT_MATERIAL);
        assertThat(testClothingItem.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testClothingItem.getLastWorn()).isEqualTo(DEFAULT_LAST_WORN);
    }

    @Test
    @Transactional
    void createClothingItemWithExistingId() throws Exception {
        // Create the ClothingItem with an existing ID
        clothingItem.setId(1L);

        int databaseSizeBeforeCreate = clothingItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClothingItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isBadRequest());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = clothingItemRepository.findAll().size();
        // set the field null
        clothingItem.setName(null);

        // Create the ClothingItem, which fails.

        restClothingItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isBadRequest());

        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = clothingItemRepository.findAll().size();
        // set the field null
        clothingItem.setType(null);

        // Create the ClothingItem, which fails.

        restClothingItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isBadRequest());

        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = clothingItemRepository.findAll().size();
        // set the field null
        clothingItem.setStatus(null);

        // Create the ClothingItem, which fails.

        restClothingItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isBadRequest());

        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllClothingItems() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        // Get all the clothingItemList
        restClothingItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clothingItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].clothingSize").value(hasItem(DEFAULT_CLOTHING_SIZE)))
            .andExpect(jsonPath("$.[*].colour").value(hasItem(DEFAULT_COLOUR)))
            .andExpect(jsonPath("$.[*].style").value(hasItem(DEFAULT_STYLE)))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].material").value(hasItem(DEFAULT_MATERIAL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].lastWorn").value(hasItem(DEFAULT_LAST_WORN.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClothingItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(clothingItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClothingItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(clothingItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClothingItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(clothingItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClothingItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(clothingItemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getClothingItem() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        // Get the clothingItem
        restClothingItemMockMvc
            .perform(get(ENTITY_API_URL_ID, clothingItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clothingItem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.clothingSize").value(DEFAULT_CLOTHING_SIZE))
            .andExpect(jsonPath("$.colour").value(DEFAULT_COLOUR))
            .andExpect(jsonPath("$.style").value(DEFAULT_STYLE))
            .andExpect(jsonPath("$.brand").value(DEFAULT_BRAND))
            .andExpect(jsonPath("$.material").value(DEFAULT_MATERIAL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.lastWorn").value(DEFAULT_LAST_WORN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingClothingItem() throws Exception {
        // Get the clothingItem
        restClothingItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClothingItem() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();

        // Update the clothingItem
        ClothingItem updatedClothingItem = clothingItemRepository.findById(clothingItem.getId()).get();
        // Disconnect from session so that the updates on updatedClothingItem are not directly saved in db
        em.detach(updatedClothingItem);
        updatedClothingItem
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .clothingSize(UPDATED_CLOTHING_SIZE)
            .colour(UPDATED_COLOUR)
            .style(UPDATED_STYLE)
            .brand(UPDATED_BRAND)
            .material(UPDATED_MATERIAL)
            .status(UPDATED_STATUS)
            .lastWorn(UPDATED_LAST_WORN);

        restClothingItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClothingItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClothingItem))
            )
            .andExpect(status().isOk());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
        ClothingItem testClothingItem = clothingItemList.get(clothingItemList.size() - 1);
        assertThat(testClothingItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testClothingItem.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testClothingItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testClothingItem.getClothingSize()).isEqualTo(UPDATED_CLOTHING_SIZE);
        assertThat(testClothingItem.getColour()).isEqualTo(UPDATED_COLOUR);
        assertThat(testClothingItem.getStyle()).isEqualTo(UPDATED_STYLE);
        assertThat(testClothingItem.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testClothingItem.getMaterial()).isEqualTo(UPDATED_MATERIAL);
        assertThat(testClothingItem.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testClothingItem.getLastWorn()).isEqualTo(UPDATED_LAST_WORN);
    }

    @Test
    @Transactional
    void putNonExistingClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clothingItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clothingItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clothingItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clothingItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClothingItemWithPatch() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();

        // Update the clothingItem using partial update
        ClothingItem partialUpdatedClothingItem = new ClothingItem();
        partialUpdatedClothingItem.setId(clothingItem.getId());

        partialUpdatedClothingItem
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .clothingSize(UPDATED_CLOTHING_SIZE)
            .colour(UPDATED_COLOUR)
            .brand(UPDATED_BRAND)
            .material(UPDATED_MATERIAL)
            .status(UPDATED_STATUS);

        restClothingItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothingItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClothingItem))
            )
            .andExpect(status().isOk());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
        ClothingItem testClothingItem = clothingItemList.get(clothingItemList.size() - 1);
        assertThat(testClothingItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testClothingItem.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testClothingItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testClothingItem.getClothingSize()).isEqualTo(UPDATED_CLOTHING_SIZE);
        assertThat(testClothingItem.getColour()).isEqualTo(UPDATED_COLOUR);
        assertThat(testClothingItem.getStyle()).isEqualTo(DEFAULT_STYLE);
        assertThat(testClothingItem.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testClothingItem.getMaterial()).isEqualTo(UPDATED_MATERIAL);
        assertThat(testClothingItem.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testClothingItem.getLastWorn()).isEqualTo(DEFAULT_LAST_WORN);
    }

    @Test
    @Transactional
    void fullUpdateClothingItemWithPatch() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();

        // Update the clothingItem using partial update
        ClothingItem partialUpdatedClothingItem = new ClothingItem();
        partialUpdatedClothingItem.setId(clothingItem.getId());

        partialUpdatedClothingItem
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .description(UPDATED_DESCRIPTION)
            .clothingSize(UPDATED_CLOTHING_SIZE)
            .colour(UPDATED_COLOUR)
            .style(UPDATED_STYLE)
            .brand(UPDATED_BRAND)
            .material(UPDATED_MATERIAL)
            .status(UPDATED_STATUS)
            .lastWorn(UPDATED_LAST_WORN);

        restClothingItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClothingItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClothingItem))
            )
            .andExpect(status().isOk());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
        ClothingItem testClothingItem = clothingItemList.get(clothingItemList.size() - 1);
        assertThat(testClothingItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testClothingItem.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testClothingItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testClothingItem.getClothingSize()).isEqualTo(UPDATED_CLOTHING_SIZE);
        assertThat(testClothingItem.getColour()).isEqualTo(UPDATED_COLOUR);
        assertThat(testClothingItem.getStyle()).isEqualTo(UPDATED_STYLE);
        assertThat(testClothingItem.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testClothingItem.getMaterial()).isEqualTo(UPDATED_MATERIAL);
        assertThat(testClothingItem.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testClothingItem.getLastWorn()).isEqualTo(UPDATED_LAST_WORN);
    }

    @Test
    @Transactional
    void patchNonExistingClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clothingItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clothingItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clothingItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClothingItem() throws Exception {
        int databaseSizeBeforeUpdate = clothingItemRepository.findAll().size();
        clothingItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClothingItemMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clothingItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClothingItem in the database
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClothingItem() throws Exception {
        // Initialize the database
        clothingItemRepository.saveAndFlush(clothingItem);

        int databaseSizeBeforeDelete = clothingItemRepository.findAll().size();

        // Delete the clothingItem
        restClothingItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, clothingItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClothingItem> clothingItemList = clothingItemRepository.findAll();
        assertThat(clothingItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
