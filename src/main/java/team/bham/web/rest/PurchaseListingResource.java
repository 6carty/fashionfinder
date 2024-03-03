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
import team.bham.domain.PurchaseListing;
import team.bham.repository.PurchaseListingRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.PurchaseListing}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PurchaseListingResource {

    private final Logger log = LoggerFactory.getLogger(PurchaseListingResource.class);

    private static final String ENTITY_NAME = "purchaseListing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PurchaseListingRepository purchaseListingRepository;

    public PurchaseListingResource(PurchaseListingRepository purchaseListingRepository) {
        this.purchaseListingRepository = purchaseListingRepository;
    }

    /**
     * {@code POST  /purchase-listings} : Create a new purchaseListing.
     *
     * @param purchaseListing the purchaseListing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseListing, or with status {@code 400 (Bad Request)} if the purchaseListing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/purchase-listings")
    public ResponseEntity<PurchaseListing> createPurchaseListing(@Valid @RequestBody PurchaseListing purchaseListing)
        throws URISyntaxException {
        log.debug("REST request to save PurchaseListing : {}", purchaseListing);
        if (purchaseListing.getId() != null) {
            throw new BadRequestAlertException("A new purchaseListing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PurchaseListing result = purchaseListingRepository.save(purchaseListing);
        return ResponseEntity
            .created(new URI("/api/purchase-listings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /purchase-listings/:id} : Updates an existing purchaseListing.
     *
     * @param id the id of the purchaseListing to save.
     * @param purchaseListing the purchaseListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseListing,
     * or with status {@code 400 (Bad Request)} if the purchaseListing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/purchase-listings/{id}")
    public ResponseEntity<PurchaseListing> updatePurchaseListing(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PurchaseListing purchaseListing
    ) throws URISyntaxException {
        log.debug("REST request to update PurchaseListing : {}, {}", id, purchaseListing);
        if (purchaseListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PurchaseListing result = purchaseListingRepository.save(purchaseListing);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, purchaseListing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /purchase-listings/:id} : Partial updates given fields of an existing purchaseListing, field will ignore if it is null
     *
     * @param id the id of the purchaseListing to save.
     * @param purchaseListing the purchaseListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseListing,
     * or with status {@code 400 (Bad Request)} if the purchaseListing is not valid,
     * or with status {@code 404 (Not Found)} if the purchaseListing is not found,
     * or with status {@code 500 (Internal Server Error)} if the purchaseListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/purchase-listings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PurchaseListing> partialUpdatePurchaseListing(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PurchaseListing purchaseListing
    ) throws URISyntaxException {
        log.debug("REST request to partial update PurchaseListing partially : {}, {}", id, purchaseListing);
        if (purchaseListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseListing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseListingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PurchaseListing> result = purchaseListingRepository
            .findById(purchaseListing.getId())
            .map(existingPurchaseListing -> {
                if (purchaseListing.getItemForSale() != null) {
                    existingPurchaseListing.setItemForSale(purchaseListing.getItemForSale());
                }
                if (purchaseListing.getPrice() != null) {
                    existingPurchaseListing.setPrice(purchaseListing.getPrice());
                }

                return existingPurchaseListing;
            })
            .map(purchaseListingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, purchaseListing.getId().toString())
        );
    }

    /**
     * {@code GET  /purchase-listings} : get all the purchaseListings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseListings in body.
     */
    @GetMapping("/purchase-listings")
    public List<PurchaseListing> getAllPurchaseListings() {
        log.debug("REST request to get all PurchaseListings");
        return purchaseListingRepository.findAll();
    }

    /**
     * {@code GET  /purchase-listings/:id} : get the "id" purchaseListing.
     *
     * @param id the id of the purchaseListing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseListing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/purchase-listings/{id}")
    public ResponseEntity<PurchaseListing> getPurchaseListing(@PathVariable Long id) {
        log.debug("REST request to get PurchaseListing : {}", id);
        Optional<PurchaseListing> purchaseListing = purchaseListingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(purchaseListing);
    }

    /**
     * {@code DELETE  /purchase-listings/:id} : delete the "id" purchaseListing.
     *
     * @param id the id of the purchaseListing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/purchase-listings/{id}")
    public ResponseEntity<Void> deletePurchaseListing(@PathVariable Long id) {
        log.debug("REST request to delete PurchaseListing : {}", id);
        purchaseListingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
