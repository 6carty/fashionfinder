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
import team.bham.domain.SaleListing;
import team.bham.repository.SaleListingRepository;

/**
 * Integration tests for the {@link SaleListingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SaleListingResourceIT {

    private static final Long DEFAULT_ITEM_FOR_SALE = 1L;
    private static final Long UPDATED_ITEM_FOR_SALE = 2L;

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/sale-listings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SaleListingRepository saleListingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSaleListingMockMvc;

    private SaleListing saleListing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SaleListing createEntity(EntityManager em) {
        SaleListing saleListing = new SaleListing().itemForSale(DEFAULT_ITEM_FOR_SALE).price(DEFAULT_PRICE);
        return saleListing;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SaleListing createUpdatedEntity(EntityManager em) {
        SaleListing saleListing = new SaleListing().itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);
        return saleListing;
    }

    @BeforeEach
    public void initTest() {
        saleListing = createEntity(em);
    }

    @Test
    @Transactional
    void createSaleListing() throws Exception {
        int databaseSizeBeforeCreate = saleListingRepository.findAll().size();
        // Create the SaleListing
        restSaleListingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saleListing)))
            .andExpect(status().isCreated());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeCreate + 1);
        SaleListing testSaleListing = saleListingList.get(saleListingList.size() - 1);
        assertThat(testSaleListing.getItemForSale()).isEqualTo(DEFAULT_ITEM_FOR_SALE);
        assertThat(testSaleListing.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createSaleListingWithExistingId() throws Exception {
        // Create the SaleListing with an existing ID
        saleListing.setId(1L);

        int databaseSizeBeforeCreate = saleListingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSaleListingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saleListing)))
            .andExpect(status().isBadRequest());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkItemForSaleIsRequired() throws Exception {
        int databaseSizeBeforeTest = saleListingRepository.findAll().size();
        // set the field null
        saleListing.setItemForSale(null);

        // Create the SaleListing, which fails.

        restSaleListingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saleListing)))
            .andExpect(status().isBadRequest());

        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = saleListingRepository.findAll().size();
        // set the field null
        saleListing.setPrice(null);

        // Create the SaleListing, which fails.

        restSaleListingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saleListing)))
            .andExpect(status().isBadRequest());

        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSaleListings() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        // Get all the saleListingList
        restSaleListingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(saleListing.getId().intValue())))
            .andExpect(jsonPath("$.[*].itemForSale").value(hasItem(DEFAULT_ITEM_FOR_SALE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getSaleListing() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        // Get the saleListing
        restSaleListingMockMvc
            .perform(get(ENTITY_API_URL_ID, saleListing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(saleListing.getId().intValue()))
            .andExpect(jsonPath("$.itemForSale").value(DEFAULT_ITEM_FOR_SALE.intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingSaleListing() throws Exception {
        // Get the saleListing
        restSaleListingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSaleListing() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();

        // Update the saleListing
        SaleListing updatedSaleListing = saleListingRepository.findById(saleListing.getId()).get();
        // Disconnect from session so that the updates on updatedSaleListing are not directly saved in db
        em.detach(updatedSaleListing);
        updatedSaleListing.itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);

        restSaleListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSaleListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSaleListing))
            )
            .andExpect(status().isOk());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
        SaleListing testSaleListing = saleListingList.get(saleListingList.size() - 1);
        assertThat(testSaleListing.getItemForSale()).isEqualTo(UPDATED_ITEM_FOR_SALE);
        assertThat(testSaleListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, saleListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(saleListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(saleListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saleListing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSaleListingWithPatch() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();

        // Update the saleListing using partial update
        SaleListing partialUpdatedSaleListing = new SaleListing();
        partialUpdatedSaleListing.setId(saleListing.getId());

        partialUpdatedSaleListing.price(UPDATED_PRICE);

        restSaleListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSaleListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSaleListing))
            )
            .andExpect(status().isOk());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
        SaleListing testSaleListing = saleListingList.get(saleListingList.size() - 1);
        assertThat(testSaleListing.getItemForSale()).isEqualTo(DEFAULT_ITEM_FOR_SALE);
        assertThat(testSaleListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateSaleListingWithPatch() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();

        // Update the saleListing using partial update
        SaleListing partialUpdatedSaleListing = new SaleListing();
        partialUpdatedSaleListing.setId(saleListing.getId());

        partialUpdatedSaleListing.itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);

        restSaleListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSaleListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSaleListing))
            )
            .andExpect(status().isOk());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
        SaleListing testSaleListing = saleListingList.get(saleListingList.size() - 1);
        assertThat(testSaleListing.getItemForSale()).isEqualTo(UPDATED_ITEM_FOR_SALE);
        assertThat(testSaleListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, saleListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(saleListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(saleListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSaleListing() throws Exception {
        int databaseSizeBeforeUpdate = saleListingRepository.findAll().size();
        saleListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaleListingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(saleListing))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SaleListing in the database
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSaleListing() throws Exception {
        // Initialize the database
        saleListingRepository.saveAndFlush(saleListing);

        int databaseSizeBeforeDelete = saleListingRepository.findAll().size();

        // Delete the saleListing
        restSaleListingMockMvc
            .perform(delete(ENTITY_API_URL_ID, saleListing.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SaleListing> saleListingList = saleListingRepository.findAll();
        assertThat(saleListingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
