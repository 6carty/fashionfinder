package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.OutfitPic;
import team.bham.repository.OutfitPicRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.OutfitPic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OutfitPicResource {

    private final Logger log = LoggerFactory.getLogger(OutfitPicResource.class);

    private static final String ENTITY_NAME = "outfitPic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OutfitPicRepository outfitPicRepository;

    public OutfitPicResource(OutfitPicRepository outfitPicRepository) {
        this.outfitPicRepository = outfitPicRepository;
    }

    /**
     * {@code POST  /outfit-pics} : Create a new outfitPic.
     *
     * @param outfitPic the outfitPic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new outfitPic, or with status {@code 400 (Bad Request)} if the outfitPic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/outfit-pics")
    public ResponseEntity<OutfitPic> createOutfitPic(@RequestBody OutfitPic outfitPic) throws URISyntaxException {
        log.debug("REST request to save OutfitPic : {}", outfitPic);
        if (outfitPic.getId() != null) {
            throw new BadRequestAlertException("A new outfitPic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OutfitPic result = outfitPicRepository.save(outfitPic);
        return ResponseEntity
            .created(new URI("/api/outfit-pics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /outfit-pics/:id} : Updates an existing outfitPic.
     *
     * @param id the id of the outfitPic to save.
     * @param outfitPic the outfitPic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outfitPic,
     * or with status {@code 400 (Bad Request)} if the outfitPic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the outfitPic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/outfit-pics/{id}")
    public ResponseEntity<OutfitPic> updateOutfitPic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OutfitPic outfitPic
    ) throws URISyntaxException {
        log.debug("REST request to update OutfitPic : {}, {}", id, outfitPic);
        if (outfitPic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outfitPic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outfitPicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OutfitPic result = outfitPicRepository.save(outfitPic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, outfitPic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /outfit-pics/:id} : Partial updates given fields of an existing outfitPic, field will ignore if it is null
     *
     * @param id the id of the outfitPic to save.
     * @param outfitPic the outfitPic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated outfitPic,
     * or with status {@code 400 (Bad Request)} if the outfitPic is not valid,
     * or with status {@code 404 (Not Found)} if the outfitPic is not found,
     * or with status {@code 500 (Internal Server Error)} if the outfitPic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/outfit-pics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OutfitPic> partialUpdateOutfitPic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OutfitPic outfitPic
    ) throws URISyntaxException {
        log.debug("REST request to partial update OutfitPic partially : {}, {}", id, outfitPic);
        if (outfitPic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, outfitPic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!outfitPicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OutfitPic> result = outfitPicRepository
            .findById(outfitPic.getId())
            .map(existingOutfitPic -> {
                if (outfitPic.getImage() != null) {
                    existingOutfitPic.setImage(outfitPic.getImage());
                }
                if (outfitPic.getImageContentType() != null) {
                    existingOutfitPic.setImageContentType(outfitPic.getImageContentType());
                }

                return existingOutfitPic;
            })
            .map(outfitPicRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, outfitPic.getId().toString())
        );
    }

    /**
     * {@code GET  /outfit-pics} : get all the outfitPics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of outfitPics in body.
     */
    @GetMapping("/outfit-pics")
    public List<OutfitPic> getAllOutfitPics() {
        log.debug("REST request to get all OutfitPics");
        return outfitPicRepository.findAll();
    }

    /**
     * {@code GET  /outfit-pics/:id} : get the "id" outfitPic.
     *
     * @param id the id of the outfitPic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the outfitPic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/outfit-pics/{id}")
    public ResponseEntity<OutfitPic> getOutfitPic(@PathVariable Long id) {
        log.debug("REST request to get OutfitPic : {}", id);
        Optional<OutfitPic> outfitPic = outfitPicRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(outfitPic);
    }

    /**
     * {@code DELETE  /outfit-pics/:id} : delete the "id" outfitPic.
     *
     * @param id the id of the outfitPic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/outfit-pics/{id}")
    public ResponseEntity<Void> deleteOutfitPic(@PathVariable Long id) {
        log.debug("REST request to delete OutfitPic : {}", id);
        outfitPicRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
