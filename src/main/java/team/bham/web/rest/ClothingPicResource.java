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
import team.bham.domain.ClothingPic;
import team.bham.repository.ClothingPicRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ClothingPic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClothingPicResource {

    private final Logger log = LoggerFactory.getLogger(ClothingPicResource.class);

    private static final String ENTITY_NAME = "clothingPic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClothingPicRepository clothingPicRepository;

    public ClothingPicResource(ClothingPicRepository clothingPicRepository) {
        this.clothingPicRepository = clothingPicRepository;
    }

    /**
     * {@code POST  /clothing-pics} : Create a new clothingPic.
     *
     * @param clothingPic the clothingPic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clothingPic, or with status {@code 400 (Bad Request)} if the clothingPic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clothing-pics")
    public ResponseEntity<ClothingPic> createClothingPic(@RequestBody ClothingPic clothingPic) throws URISyntaxException {
        log.debug("REST request to save ClothingPic : {}", clothingPic);
        if (clothingPic.getId() != null) {
            throw new BadRequestAlertException("A new clothingPic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClothingPic result = clothingPicRepository.save(clothingPic);
        return ResponseEntity
            .created(new URI("/api/clothing-pics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clothing-pics/:id} : Updates an existing clothingPic.
     *
     * @param id the id of the clothingPic to save.
     * @param clothingPic the clothingPic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothingPic,
     * or with status {@code 400 (Bad Request)} if the clothingPic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clothingPic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clothing-pics/{id}")
    public ResponseEntity<ClothingPic> updateClothingPic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClothingPic clothingPic
    ) throws URISyntaxException {
        log.debug("REST request to update ClothingPic : {}, {}", id, clothingPic);
        if (clothingPic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothingPic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clothingPicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClothingPic result = clothingPicRepository.save(clothingPic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clothingPic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clothing-pics/:id} : Partial updates given fields of an existing clothingPic, field will ignore if it is null
     *
     * @param id the id of the clothingPic to save.
     * @param clothingPic the clothingPic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothingPic,
     * or with status {@code 400 (Bad Request)} if the clothingPic is not valid,
     * or with status {@code 404 (Not Found)} if the clothingPic is not found,
     * or with status {@code 500 (Internal Server Error)} if the clothingPic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clothing-pics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClothingPic> partialUpdateClothingPic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClothingPic clothingPic
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClothingPic partially : {}, {}", id, clothingPic);
        if (clothingPic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothingPic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clothingPicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClothingPic> result = clothingPicRepository
            .findById(clothingPic.getId())
            .map(existingClothingPic -> {
                if (clothingPic.getImage() != null) {
                    existingClothingPic.setImage(clothingPic.getImage());
                }
                if (clothingPic.getImageContentType() != null) {
                    existingClothingPic.setImageContentType(clothingPic.getImageContentType());
                }

                return existingClothingPic;
            })
            .map(clothingPicRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clothingPic.getId().toString())
        );
    }

    /**
     * {@code GET  /clothing-pics} : get all the clothingPics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clothingPics in body.
     */
    @GetMapping("/clothing-pics")
    public List<ClothingPic> getAllClothingPics() {
        log.debug("REST request to get all ClothingPics");
        return clothingPicRepository.findAll();
    }

    /**
     * {@code GET  /clothing-pics/:id} : get the "id" clothingPic.
     *
     * @param id the id of the clothingPic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clothingPic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clothing-pics/{id}")
    public ResponseEntity<ClothingPic> getClothingPic(@PathVariable Long id) {
        log.debug("REST request to get ClothingPic : {}", id);
        Optional<ClothingPic> clothingPic = clothingPicRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clothingPic);
    }

    /**
     * {@code DELETE  /clothing-pics/:id} : delete the "id" clothingPic.
     *
     * @param id the id of the clothingPic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clothing-pics/{id}")
    public ResponseEntity<Void> deleteClothingPic(@PathVariable Long id) {
        log.debug("REST request to delete ClothingPic : {}", id);
        clothingPicRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
