package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.ExchangeRequest;
import team.bham.repository.ExchangeRequestRepository;

/**
 * Integration tests for the {@link ExchangeRequestResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExchangeRequestResourceIT {

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/exchange-requests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Mock
    private ExchangeRequestRepository exchangeRequestRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExchangeRequestMockMvc;

    private ExchangeRequest exchangeRequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExchangeRequest createEntity(EntityManager em) {
        ExchangeRequest exchangeRequest = new ExchangeRequest()
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .description(DEFAULT_DESCRIPTION);
        return exchangeRequest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExchangeRequest createUpdatedEntity(EntityManager em) {
        ExchangeRequest exchangeRequest = new ExchangeRequest()
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .description(UPDATED_DESCRIPTION);
        return exchangeRequest;
    }

    @BeforeEach
    public void initTest() {
        exchangeRequest = createEntity(em);
    }

    @Test
    @Transactional
    void createExchangeRequest() throws Exception {
        int databaseSizeBeforeCreate = exchangeRequestRepository.findAll().size();
        // Create the ExchangeRequest
        restExchangeRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isCreated());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeCreate + 1);
        ExchangeRequest testExchangeRequest = exchangeRequestList.get(exchangeRequestList.size() - 1);
        assertThat(testExchangeRequest.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testExchangeRequest.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testExchangeRequest.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createExchangeRequestWithExistingId() throws Exception {
        // Create the ExchangeRequest with an existing ID
        exchangeRequest.setId(1L);

        int databaseSizeBeforeCreate = exchangeRequestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExchangeRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = exchangeRequestRepository.findAll().size();
        // set the field null
        exchangeRequest.setDescription(null);

        // Create the ExchangeRequest, which fails.

        restExchangeRequestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExchangeRequests() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        // Get all the exchangeRequestList
        restExchangeRequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(exchangeRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExchangeRequestsWithEagerRelationshipsIsEnabled() throws Exception {
        when(exchangeRequestRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExchangeRequestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(exchangeRequestRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExchangeRequestsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(exchangeRequestRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExchangeRequestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(exchangeRequestRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getExchangeRequest() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        // Get the exchangeRequest
        restExchangeRequestMockMvc
            .perform(get(ENTITY_API_URL_ID, exchangeRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(exchangeRequest.getId().intValue()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingExchangeRequest() throws Exception {
        // Get the exchangeRequest
        restExchangeRequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExchangeRequest() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();

        // Update the exchangeRequest
        ExchangeRequest updatedExchangeRequest = exchangeRequestRepository.findById(exchangeRequest.getId()).get();
        // Disconnect from session so that the updates on updatedExchangeRequest are not directly saved in db
        em.detach(updatedExchangeRequest);
        updatedExchangeRequest.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE).description(UPDATED_DESCRIPTION);

        restExchangeRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExchangeRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExchangeRequest))
            )
            .andExpect(status().isOk());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
        ExchangeRequest testExchangeRequest = exchangeRequestList.get(exchangeRequestList.size() - 1);
        assertThat(testExchangeRequest.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testExchangeRequest.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testExchangeRequest.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exchangeRequest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExchangeRequestWithPatch() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();

        // Update the exchangeRequest using partial update
        ExchangeRequest partialUpdatedExchangeRequest = new ExchangeRequest();
        partialUpdatedExchangeRequest.setId(exchangeRequest.getId());

        partialUpdatedExchangeRequest.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restExchangeRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExchangeRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExchangeRequest))
            )
            .andExpect(status().isOk());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
        ExchangeRequest testExchangeRequest = exchangeRequestList.get(exchangeRequestList.size() - 1);
        assertThat(testExchangeRequest.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testExchangeRequest.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testExchangeRequest.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateExchangeRequestWithPatch() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();

        // Update the exchangeRequest using partial update
        ExchangeRequest partialUpdatedExchangeRequest = new ExchangeRequest();
        partialUpdatedExchangeRequest.setId(exchangeRequest.getId());

        partialUpdatedExchangeRequest.image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE).description(UPDATED_DESCRIPTION);

        restExchangeRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExchangeRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExchangeRequest))
            )
            .andExpect(status().isOk());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
        ExchangeRequest testExchangeRequest = exchangeRequestList.get(exchangeRequestList.size() - 1);
        assertThat(testExchangeRequest.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testExchangeRequest.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testExchangeRequest.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, exchangeRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExchangeRequest() throws Exception {
        int databaseSizeBeforeUpdate = exchangeRequestRepository.findAll().size();
        exchangeRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExchangeRequestMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exchangeRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExchangeRequest in the database
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExchangeRequest() throws Exception {
        // Initialize the database
        exchangeRequestRepository.saveAndFlush(exchangeRequest);

        int databaseSizeBeforeDelete = exchangeRequestRepository.findAll().size();

        // Delete the exchangeRequest
        restExchangeRequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, exchangeRequest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExchangeRequest> exchangeRequestList = exchangeRequestRepository.findAll();
        assertThat(exchangeRequestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
