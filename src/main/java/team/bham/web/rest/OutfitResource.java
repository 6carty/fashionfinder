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
import team.bham.domain.Outfit;
import team.bham.repository.OutfitRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Outfit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OutfitResource {

    private final Logger log = LoggerFactory.getLogger(OutfitResource.class);

    private static final String ENTITY_NAME = "outfit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OutfitRepository outfitRepository;

    public OutfitResource(OutfitRepository outfitRepository) {
        this.outfitRepository = outfitRepository;
    }

    /**
     * {@code POST  /outfits} : Create a new outfit.
     *
     * @param outfit the outfit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new outfit, or with status {@code 400 (Bad Request)} if the outfit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/outfits")
    public ResponseEntity<Outfit> createOutfit(@Valid @RequestBody Outfit outfit) throws URISyntaxException {
        log.debug("REST request to save Outfit : {}", outfit);
        if (outfit.getId() != null) {
            throw new BadRequestAlertException("A new outfit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Outfit result = outfitRepository.save(outfit);
        return ResponseEntity
            .created(new URI("/api/outfits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /outfits/:id} : Updates an existing outfit.
     *
     * @param id the id of the outfit to save.
     * @param outfit the outfit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outfit,
     * or with status {@code 400 (Bad Request)} if the outfit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the outfit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/outfits/{id}")
    public ResponseEntity<Outfit> updateOutfit(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Outfit outfit
    ) throws URISyntaxException {
        log.debug("REST request to update Outfit : {}, {}", id, outfit);
        if (outfit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outfit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outfitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Outfit result = outfitRepository.save(outfit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, outfit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /outfits/:id} : Partial updates given fields of an existing outfit, field will ignore if it is null
     *
     * @param id the id of the outfit to save.
     * @param outfit the outfit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outfit,
     * or with status {@code 400 (Bad Request)} if the outfit is not valid,
     * or with status {@code 404 (Not Found)} if the outfit is not found,
     * or with status {@code 500 (Internal Server Error)} if the outfit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/outfits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Outfit> partialUpdateOutfit(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Outfit outfit
    ) throws URISyntaxException {
        log.debug("REST request to partial update Outfit partially : {}, {}", id, outfit);
        if (outfit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outfit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outfitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Outfit> result = outfitRepository
            .findById(outfit.getId())
            .map(existingOutfit -> {
                if (outfit.getName() != null) {
                    existingOutfit.setName(outfit.getName());
                }
                if (outfit.getDescription() != null) {
                    existingOutfit.setDescription(outfit.getDescription());
                }
                if (outfit.getDate() != null) {
                    existingOutfit.setDate(outfit.getDate());
                }
                if (outfit.getOccasion() != null) {
                    existingOutfit.setOccasion(outfit.getOccasion());
                }
                if (outfit.getImage() != null) {
                    existingOutfit.setImage(outfit.getImage());
                }
                if (outfit.getImageContentType() != null) {
                    existingOutfit.setImageContentType(outfit.getImageContentType());
                }

                return existingOutfit;
            })
            .map(outfitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, outfit.getId().toString())
        );
    }

    /**
     * {@code GET  /outfits} : get all the outfits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of outfits in body.
     */
    @GetMapping("/outfits")
    public List<Outfit> getAllOutfits() {
        log.debug("REST request to get all Outfits");
        return outfitRepository.findAll();
    }

    /**
     * {@code GET  /outfits/:id} : get the "id" outfit.
     *
     * @param id the id of the outfit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the outfit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/outfits/{id}")
    public ResponseEntity<Outfit> getOutfit(@PathVariable Long id) {
        log.debug("REST request to get Outfit : {}", id);
        Optional<Outfit> outfit = outfitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(outfit);
    }

    /**
     * {@code DELETE  /outfits/:id} : delete the "id" outfit.
     *
     * @param id the id of the outfit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/outfits/{id}")
    public ResponseEntity<Void> deleteOutfit(@PathVariable Long id) {
        log.debug("REST request to delete Outfit : {}", id);
        outfitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
