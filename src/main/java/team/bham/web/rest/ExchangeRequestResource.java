package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.ExchangeRequest;
import team.bham.repository.ExchangeRequestRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ExchangeRequest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExchangeRequestResource {

    private final Logger log = LoggerFactory.getLogger(ExchangeRequestResource.class);

    private static final String ENTITY_NAME = "exchangeRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExchangeRequestRepository exchangeRequestRepository;

    public ExchangeRequestResource(ExchangeRequestRepository exchangeRequestRepository) {
        this.exchangeRequestRepository = exchangeRequestRepository;
    }

    /**
     * {@code POST  /exchange-requests} : Create a new exchangeRequest.
     *
     * @param exchangeRequest the exchangeRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exchangeRequest, or with status {@code 400 (Bad Request)} if the exchangeRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exchange-requests")
    public ResponseEntity<ExchangeRequest> createExchangeRequest(@Valid @RequestBody ExchangeRequest exchangeRequest)
        throws URISyntaxException {
        log.debug("REST request to save ExchangeRequest : {}", exchangeRequest);
        if (exchangeRequest.getId() != null) {
            throw new BadRequestAlertException("A new exchangeRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExchangeRequest result = exchangeRequestRepository.save(exchangeRequest);
        return ResponseEntity
            .created(new URI("/api/exchange-requests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /exchange-requests/:id} : Updates an existing exchangeRequest.
     *
     * @param id the id of the exchangeRequest to save.
     * @param exchangeRequest the exchangeRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exchangeRequest,
     * or with status {@code 400 (Bad Request)} if the exchangeRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exchangeRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exchange-requests/{id}")
    public ResponseEntity<ExchangeRequest> updateExchangeRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ExchangeRequest exchangeRequest
    ) throws URISyntaxException {
        log.debug("REST request to update ExchangeRequest : {}, {}", id, exchangeRequest);
        if (exchangeRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exchangeRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exchangeRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExchangeRequest result = exchangeRequestRepository.save(exchangeRequest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, exchangeRequest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /exchange-requests/:id} : Partial updates given fields of an existing exchangeRequest, field will ignore if it is null
     *
     * @param id the id of the exchangeRequest to save.
     * @param exchangeRequest the exchangeRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exchangeRequest,
     * or with status {@code 400 (Bad Request)} if the exchangeRequest is not valid,
     * or with status {@code 404 (Not Found)} if the exchangeRequest is not found,
     * or with status {@code 500 (Internal Server Error)} if the exchangeRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exchange-requests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExchangeRequest> partialUpdateExchangeRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ExchangeRequest exchangeRequest
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExchangeRequest partially : {}, {}", id, exchangeRequest);
        if (exchangeRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exchangeRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exchangeRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExchangeRequest> result = exchangeRequestRepository
            .findById(exchangeRequest.getId())
            .map(existingExchangeRequest -> {
                if (exchangeRequest.getImage() != null) {
                    existingExchangeRequest.setImage(exchangeRequest.getImage());
                }
                if (exchangeRequest.getImageContentType() != null) {
                    existingExchangeRequest.setImageContentType(exchangeRequest.getImageContentType());
                }
                if (exchangeRequest.getDescription() != null) {
                    existingExchangeRequest.setDescription(exchangeRequest.getDescription());
                }

                return existingExchangeRequest;
            })
            .map(exchangeRequestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, exchangeRequest.getId().toString())
        );
    }

    /**
     * {@code GET  /exchange-requests} : get all the exchangeRequests.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exchangeRequests in body.
     */
    @GetMapping("/exchange-requests")
    public List<ExchangeRequest> getAllExchangeRequests(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ExchangeRequests");
        if (eagerload) {
            return exchangeRequestRepository.findAllWithEagerRelationships();
        } else {
            return exchangeRequestRepository.findAll();
        }
    }

    /**
     * {@code GET  /exchange-requests/:id} : get the "id" exchangeRequest.
     *
     * @param id the id of the exchangeRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exchangeRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exchange-requests/{id}")
    public ResponseEntity<ExchangeRequest> getExchangeRequest(@PathVariable Long id) {
        log.debug("REST request to get ExchangeRequest : {}", id);
        Optional<ExchangeRequest> exchangeRequest = exchangeRequestRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(exchangeRequest);
    }

    /**
     * {@code DELETE  /exchange-requests/:id} : delete the "id" exchangeRequest.
     *
     * @param id the id of the exchangeRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exchange-requests/{id}")
    public ResponseEntity<Void> deleteExchangeRequest(@PathVariable Long id) {
        log.debug("REST request to delete ExchangeRequest : {}", id);
        exchangeRequestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
