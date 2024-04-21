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
import team.bham.domain.ItemLog;
import team.bham.repository.ItemLogRepository;

/**
 * Integration tests for the {@link ItemLogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemLogResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/item-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemLogRepository itemLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemLogMockMvc;

    private ItemLog itemLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemLog createEntity(EntityManager em) {
        ItemLog itemLog = new ItemLog().date(DEFAULT_DATE);
        return itemLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemLog createUpdatedEntity(EntityManager em) {
        ItemLog itemLog = new ItemLog().date(UPDATED_DATE);
        return itemLog;
    }

    @BeforeEach
    public void initTest() {
        itemLog = createEntity(em);
    }

    @Test
    @Transactional
    void createItemLog() throws Exception {
        int databaseSizeBeforeCreate = itemLogRepository.findAll().size();
        // Create the ItemLog
        restItemLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemLog)))
            .andExpect(status().isCreated());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeCreate + 1);
        ItemLog testItemLog = itemLogList.get(itemLogList.size() - 1);
        assertThat(testItemLog.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createItemLogWithExistingId() throws Exception {
        // Create the ItemLog with an existing ID
        itemLog.setId(1L);

        int databaseSizeBeforeCreate = itemLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemLog)))
            .andExpect(status().isBadRequest());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemLogRepository.findAll().size();
        // set the field null
        itemLog.setDate(null);

        // Create the ItemLog, which fails.

        restItemLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemLog)))
            .andExpect(status().isBadRequest());

        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllItemLogs() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        // Get all the itemLogList
        restItemLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getItemLog() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        // Get the itemLog
        restItemLogMockMvc
            .perform(get(ENTITY_API_URL_ID, itemLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemLog.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingItemLog() throws Exception {
        // Get the itemLog
        restItemLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemLog() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();

        // Update the itemLog
        ItemLog updatedItemLog = itemLogRepository.findById(itemLog.getId()).get();
        // Disconnect from session so that the updates on updatedItemLog are not directly saved in db
        em.detach(updatedItemLog);
        updatedItemLog.date(UPDATED_DATE);

        restItemLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemLog))
            )
            .andExpect(status().isOk());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
        ItemLog testItemLog = itemLogList.get(itemLogList.size() - 1);
        assertThat(testItemLog.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemLog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemLogWithPatch() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();

        // Update the itemLog using partial update
        ItemLog partialUpdatedItemLog = new ItemLog();
        partialUpdatedItemLog.setId(itemLog.getId());

        partialUpdatedItemLog.date(UPDATED_DATE);

        restItemLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemLog))
            )
            .andExpect(status().isOk());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
        ItemLog testItemLog = itemLogList.get(itemLogList.size() - 1);
        assertThat(testItemLog.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateItemLogWithPatch() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();

        // Update the itemLog using partial update
        ItemLog partialUpdatedItemLog = new ItemLog();
        partialUpdatedItemLog.setId(itemLog.getId());

        partialUpdatedItemLog.date(UPDATED_DATE);

        restItemLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemLog))
            )
            .andExpect(status().isOk());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
        ItemLog testItemLog = itemLogList.get(itemLogList.size() - 1);
        assertThat(testItemLog.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemLog() throws Exception {
        int databaseSizeBeforeUpdate = itemLogRepository.findAll().size();
        itemLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemLogMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemLog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemLog in the database
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemLog() throws Exception {
        // Initialize the database
        itemLogRepository.saveAndFlush(itemLog);

        int databaseSizeBeforeDelete = itemLogRepository.findAll().size();

        // Delete the itemLog
        restItemLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemLog.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemLog> itemLogList = itemLogRepository.findAll();
        assertThat(itemLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
