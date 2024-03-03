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
import team.bham.domain.SaleListing;
import team.bham.repository.SaleListingRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SaleListing}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SaleListingResource {

    private final Logger log = LoggerFactory.getLogger(SaleListingResource.class);

    private static final String ENTITY_NAME = "saleListing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SaleListingRepository saleListingRepository;

    public SaleListingResource(SaleListingRepository saleListingRepository) {
        this.saleListingRepository = saleListingRepository;
    }

    /**
     * {@code POST  /sale-listings} : Create a new saleListing.
     *
     * @param saleListing the saleListing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new saleListing, or with status {@code 400 (Bad Request)} if the saleListing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sale-listings")
    public ResponseEntity<SaleListing> createSaleListing(@Valid @RequestBody SaleListing saleListing) throws URISyntaxException {
        log.debug("REST request to save SaleListing : {}", saleListing);
        if (saleListing.getId() != null) {
            throw new BadRequestAlertException("A new saleListing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SaleListing result = saleListingRepository.save(saleListing);
        return ResponseEntity
            .created(new URI("/api/sale-listings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sale-listings/:id} : Updates an existing saleListing.
     *
     * @param id the id of the saleListing to save.
     * @param saleListing the saleListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saleListing,
     * or with status {@code 400 (Bad Request)} if the saleListing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the saleListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sale-listings/{id}")
    public ResponseEntity<SaleListing> updateSaleListing(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SaleListing saleListing
    ) throws URISyntaxException {
        log.debug("REST request to update SaleListing : {}, {}", id, saleListing);
        if (saleListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saleListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!saleListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SaleListing result = saleListingRepository.save(saleListing);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, saleListing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sale-listings/:id} : Partial updates given fields of an existing saleListing, field will ignore if it is null
     *
     * @param id the id of the saleListing to save.
     * @param saleListing the saleListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saleListing,
     * or with status {@code 400 (Bad Request)} if the saleListing is not valid,
     * or with status {@code 404 (Not Found)} if the saleListing is not found,
     * or with status {@code 500 (Internal Server Error)} if the saleListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sale-listings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SaleListing> partialUpdateSaleListing(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SaleListing saleListing
    ) throws URISyntaxException {
        log.debug("REST request to partial update SaleListing partially : {}, {}", id, saleListing);
        if (saleListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saleListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!saleListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SaleListing> result = saleListingRepository
            .findById(saleListing.getId())
            .map(existingSaleListing -> {
                if (saleListing.getItemForSale() != null) {
                    existingSaleListing.setItemForSale(saleListing.getItemForSale());
                }
                if (saleListing.getPrice() != null) {
                    existingSaleListing.setPrice(saleListing.getPrice());
                }

                return existingSaleListing;
            })
            .map(saleListingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, saleListing.getId().toString())
        );
    }

    /**
     * {@code GET  /sale-listings} : get all the saleListings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of saleListings in body.
     */
    @GetMapping("/sale-listings")
    public List<SaleListing> getAllSaleListings() {
        log.debug("REST request to get all SaleListings");
        return saleListingRepository.findAll();
    }

    /**
     * {@code GET  /sale-listings/:id} : get the "id" saleListing.
     *
     * @param id the id of the saleListing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saleListing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sale-listings/{id}")
    public ResponseEntity<SaleListing> getSaleListing(@PathVariable Long id) {
        log.debug("REST request to get SaleListing : {}", id);
        Optional<SaleListing> saleListing = saleListingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(saleListing);
    }

    /**
     * {@code DELETE  /sale-listings/:id} : delete the "id" saleListing.
     *
     * @param id the id of the saleListing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sale-listings/{id}")
    public ResponseEntity<Void> deleteSaleListing(@PathVariable Long id) {
        log.debug("REST request to delete SaleListing : {}", id);
        saleListingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
