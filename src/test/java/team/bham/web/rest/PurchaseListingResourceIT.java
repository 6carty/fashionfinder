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
import team.bham.domain.PurchaseListing;
import team.bham.repository.PurchaseListingRepository;

/**
 * Integration tests for the {@link PurchaseListingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PurchaseListingResourceIT {

    private static final Long DEFAULT_ITEM_FOR_SALE = 1L;
    private static final Long UPDATED_ITEM_FOR_SALE = 2L;

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/purchase-listings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PurchaseListingRepository purchaseListingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseListingMockMvc;

    private PurchaseListing purchaseListing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseListing createEntity(EntityManager em) {
        PurchaseListing purchaseListing = new PurchaseListing().itemForSale(DEFAULT_ITEM_FOR_SALE).price(DEFAULT_PRICE);
        return purchaseListing;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseListing createUpdatedEntity(EntityManager em) {
        PurchaseListing purchaseListing = new PurchaseListing().itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);
        return purchaseListing;
    }

    @BeforeEach
    public void initTest() {
        purchaseListing = createEntity(em);
    }

    @Test
    @Transactional
    void createPurchaseListing() throws Exception {
        int databaseSizeBeforeCreate = purchaseListingRepository.findAll().size();
        // Create the PurchaseListing
        restPurchaseListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isCreated());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeCreate + 1);
        PurchaseListing testPurchaseListing = purchaseListingList.get(purchaseListingList.size() - 1);
        assertThat(testPurchaseListing.getItemForSale()).isEqualTo(DEFAULT_ITEM_FOR_SALE);
        assertThat(testPurchaseListing.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createPurchaseListingWithExistingId() throws Exception {
        // Create the PurchaseListing with an existing ID
        purchaseListing.setId(1L);

        int databaseSizeBeforeCreate = purchaseListingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkItemForSaleIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseListingRepository.findAll().size();
        // set the field null
        purchaseListing.setItemForSale(null);

        // Create the PurchaseListing, which fails.

        restPurchaseListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = purchaseListingRepository.findAll().size();
        // set the field null
        purchaseListing.setPrice(null);

        // Create the PurchaseListing, which fails.

        restPurchaseListingMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPurchaseListings() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        // Get all the purchaseListingList
        restPurchaseListingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseListing.getId().intValue())))
            .andExpect(jsonPath("$.[*].itemForSale").value(hasItem(DEFAULT_ITEM_FOR_SALE.intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getPurchaseListing() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        // Get the purchaseListing
        restPurchaseListingMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseListing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseListing.getId().intValue()))
            .andExpect(jsonPath("$.itemForSale").value(DEFAULT_ITEM_FOR_SALE.intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseListing() throws Exception {
        // Get the purchaseListing
        restPurchaseListingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseListing() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();

        // Update the purchaseListing
        PurchaseListing updatedPurchaseListing = purchaseListingRepository.findById(purchaseListing.getId()).get();
        // Disconnect from session so that the updates on updatedPurchaseListing are not directly saved in db
        em.detach(updatedPurchaseListing);
        updatedPurchaseListing.itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);

        restPurchaseListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPurchaseListing))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
        PurchaseListing testPurchaseListing = purchaseListingList.get(purchaseListingList.size() - 1);
        assertThat(testPurchaseListing.getItemForSale()).isEqualTo(UPDATED_ITEM_FOR_SALE);
        assertThat(testPurchaseListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseListing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseListingWithPatch() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();

        // Update the purchaseListing using partial update
        PurchaseListing partialUpdatedPurchaseListing = new PurchaseListing();
        partialUpdatedPurchaseListing.setId(purchaseListing.getId());

        restPurchaseListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseListing))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
        PurchaseListing testPurchaseListing = purchaseListingList.get(purchaseListingList.size() - 1);
        assertThat(testPurchaseListing.getItemForSale()).isEqualTo(DEFAULT_ITEM_FOR_SALE);
        assertThat(testPurchaseListing.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdatePurchaseListingWithPatch() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();

        // Update the purchaseListing using partial update
        PurchaseListing partialUpdatedPurchaseListing = new PurchaseListing();
        partialUpdatedPurchaseListing.setId(purchaseListing.getId());

        partialUpdatedPurchaseListing.itemForSale(UPDATED_ITEM_FOR_SALE).price(UPDATED_PRICE);

        restPurchaseListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseListing))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
        PurchaseListing testPurchaseListing = purchaseListingList.get(purchaseListingList.size() - 1);
        assertThat(testPurchaseListing.getItemForSale()).isEqualTo(UPDATED_ITEM_FOR_SALE);
        assertThat(testPurchaseListing.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseListing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseListing() throws Exception {
        int databaseSizeBeforeUpdate = purchaseListingRepository.findAll().size();
        purchaseListing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseListingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseListing))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseListing in the database
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseListing() throws Exception {
        // Initialize the database
        purchaseListingRepository.saveAndFlush(purchaseListing);

        int databaseSizeBeforeDelete = purchaseListingRepository.findAll().size();

        // Delete the purchaseListing
        restPurchaseListingMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseListing.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PurchaseListing> purchaseListingList = purchaseListingRepository.findAll();
        assertThat(purchaseListingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
