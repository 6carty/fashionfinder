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
import team.bham.domain.TrendingOutfit;
import team.bham.repository.TrendingOutfitRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.TrendingOutfit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrendingOutfitResource {

    private final Logger log = LoggerFactory.getLogger(TrendingOutfitResource.class);

    private static final String ENTITY_NAME = "trendingOutfit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrendingOutfitRepository trendingOutfitRepository;

    public TrendingOutfitResource(TrendingOutfitRepository trendingOutfitRepository) {
        this.trendingOutfitRepository = trendingOutfitRepository;
    }

    /**
     * {@code POST  /trending-outfits} : Create a new trendingOutfit.
     *
     * @param trendingOutfit the trendingOutfit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trendingOutfit, or with status {@code 400 (Bad Request)} if the trendingOutfit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trending-outfits")
    public ResponseEntity<TrendingOutfit> createTrendingOutfit(@Valid @RequestBody TrendingOutfit trendingOutfit)
        throws URISyntaxException {
        log.debug("REST request to save TrendingOutfit : {}", trendingOutfit);
        if (trendingOutfit.getId() != null) {
            throw new BadRequestAlertException("A new trendingOutfit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TrendingOutfit result = trendingOutfitRepository.save(trendingOutfit);
        return ResponseEntity
            .created(new URI("/api/trending-outfits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trending-outfits/:id} : Updates an existing trendingOutfit.
     *
     * @param id the id of the trendingOutfit to save.
     * @param trendingOutfit the trendingOutfit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trendingOutfit,
     * or with status {@code 400 (Bad Request)} if the trendingOutfit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trendingOutfit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trending-outfits/{id}")
    public ResponseEntity<TrendingOutfit> updateTrendingOutfit(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TrendingOutfit trendingOutfit
    ) throws URISyntaxException {
        log.debug("REST request to update TrendingOutfit : {}, {}", id, trendingOutfit);
        if (trendingOutfit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trendingOutfit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trendingOutfitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TrendingOutfit result = trendingOutfitRepository.save(trendingOutfit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, trendingOutfit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trending-outfits/:id} : Partial updates given fields of an existing trendingOutfit, field will ignore if it is null
     *
     * @param id the id of the trendingOutfit to save.
     * @param trendingOutfit the trendingOutfit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trendingOutfit,
     * or with status {@code 400 (Bad Request)} if the trendingOutfit is not valid,
     * or with status {@code 404 (Not Found)} if the trendingOutfit is not found,
     * or with status {@code 500 (Internal Server Error)} if the trendingOutfit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trending-outfits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TrendingOutfit> partialUpdateTrendingOutfit(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TrendingOutfit trendingOutfit
    ) throws URISyntaxException {
        log.debug("REST request to partial update TrendingOutfit partially : {}, {}", id, trendingOutfit);
        if (trendingOutfit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trendingOutfit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trendingOutfitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TrendingOutfit> result = trendingOutfitRepository
            .findById(trendingOutfit.getId())
            .map(existingTrendingOutfit -> {
                if (trendingOutfit.getName() != null) {
                    existingTrendingOutfit.setName(trendingOutfit.getName());
                }
                if (trendingOutfit.getDescription() != null) {
                    existingTrendingOutfit.setDescription(trendingOutfit.getDescription());
                }

                return existingTrendingOutfit;
            })
            .map(trendingOutfitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, trendingOutfit.getId().toString())
        );
    }

    /**
     * {@code GET  /trending-outfits} : get all the trendingOutfits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trendingOutfits in body.
     */
    @GetMapping("/trending-outfits")
    public List<TrendingOutfit> getAllTrendingOutfits() {
        log.debug("REST request to get all TrendingOutfits");
        return trendingOutfitRepository.findAll();
    }

    /**
     * {@code GET  /trending-outfits/:id} : get the "id" trendingOutfit.
     *
     * @param id the id of the trendingOutfit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trendingOutfit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trending-outfits/{id}")
    public ResponseEntity<TrendingOutfit> getTrendingOutfit(@PathVariable Long id) {
        log.debug("REST request to get TrendingOutfit : {}", id);
        Optional<TrendingOutfit> trendingOutfit = trendingOutfitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(trendingOutfit);
    }

    /**
     * {@code DELETE  /trending-outfits/:id} : delete the "id" trendingOutfit.
     *
     * @param id the id of the trendingOutfit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trending-outfits/{id}")
    public ResponseEntity<Void> deleteTrendingOutfit(@PathVariable Long id) {
        log.debug("REST request to delete TrendingOutfit : {}", id);
        trendingOutfitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
