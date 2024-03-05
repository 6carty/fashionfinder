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
import team.bham.domain.ClothingItem;
import team.bham.repository.ClothingItemRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ClothingItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClothingItemResource {

    private final Logger log = LoggerFactory.getLogger(ClothingItemResource.class);

    private static final String ENTITY_NAME = "clothingItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClothingItemRepository clothingItemRepository;

    public ClothingItemResource(ClothingItemRepository clothingItemRepository) {
        this.clothingItemRepository = clothingItemRepository;
    }

    /**
     * {@code POST  /clothing-items} : Create a new clothingItem.
     *
     * @param clothingItem the clothingItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clothingItem, or with status {@code 400 (Bad Request)} if the clothingItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clothing-items")
    public ResponseEntity<ClothingItem> createClothingItem(@Valid @RequestBody ClothingItem clothingItem) throws URISyntaxException {
        log.debug("REST request to save ClothingItem : {}", clothingItem);
        if (clothingItem.getId() != null) {
            throw new BadRequestAlertException("A new clothingItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClothingItem result = clothingItemRepository.save(clothingItem);
        return ResponseEntity
            .created(new URI("/api/clothing-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clothing-items/:id} : Updates an existing clothingItem.
     *
     * @param id the id of the clothingItem to save.
     * @param clothingItem the clothingItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothingItem,
     * or with status {@code 400 (Bad Request)} if the clothingItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clothingItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clothing-items/{id}")
    public ResponseEntity<ClothingItem> updateClothingItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ClothingItem clothingItem
    ) throws URISyntaxException {
        log.debug("REST request to update ClothingItem : {}, {}", id, clothingItem);
        if (clothingItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothingItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clothingItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClothingItem result = clothingItemRepository.save(clothingItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clothingItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clothing-items/:id} : Partial updates given fields of an existing clothingItem, field will ignore if it is null
     *
     * @param id the id of the clothingItem to save.
     * @param clothingItem the clothingItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clothingItem,
     * or with status {@code 400 (Bad Request)} if the clothingItem is not valid,
     * or with status {@code 404 (Not Found)} if the clothingItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the clothingItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clothing-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClothingItem> partialUpdateClothingItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ClothingItem clothingItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClothingItem partially : {}, {}", id, clothingItem);
        if (clothingItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clothingItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clothingItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClothingItem> result = clothingItemRepository
            .findById(clothingItem.getId())
            .map(existingClothingItem -> {
                if (clothingItem.getName() != null) {
                    existingClothingItem.setName(clothingItem.getName());
                }
                if (clothingItem.getType() != null) {
                    existingClothingItem.setType(clothingItem.getType());
                }
                if (clothingItem.getClothingImg() != null) {
                    existingClothingItem.setClothingImg(clothingItem.getClothingImg());
                }
                if (clothingItem.getClothingImgContentType() != null) {
                    existingClothingItem.setClothingImgContentType(clothingItem.getClothingImgContentType());
                }
                if (clothingItem.getDescription() != null) {
                    existingClothingItem.setDescription(clothingItem.getDescription());
                }
                if (clothingItem.getClothingSize() != null) {
                    existingClothingItem.setClothingSize(clothingItem.getClothingSize());
                }
                if (clothingItem.getColour() != null) {
                    existingClothingItem.setColour(clothingItem.getColour());
                }
                if (clothingItem.getStyle() != null) {
                    existingClothingItem.setStyle(clothingItem.getStyle());
                }
                if (clothingItem.getBrand() != null) {
                    existingClothingItem.setBrand(clothingItem.getBrand());
                }
                if (clothingItem.getMaterial() != null) {
                    existingClothingItem.setMaterial(clothingItem.getMaterial());
                }
                if (clothingItem.getStatus() != null) {
                    existingClothingItem.setStatus(clothingItem.getStatus());
                }
                if (clothingItem.getLastWorn() != null) {
                    existingClothingItem.setLastWorn(clothingItem.getLastWorn());
                }

                return existingClothingItem;
            })
            .map(clothingItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clothingItem.getId().toString())
        );
    }

    /**
     * {@code GET  /clothing-items} : get all the clothingItems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clothingItems in body.
     */
    @GetMapping("/clothing-items")
    public List<ClothingItem> getAllClothingItems(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ClothingItems");
        if (eagerload) {
            return clothingItemRepository.findAllWithEagerRelationships();
        } else {
            return clothingItemRepository.findAll();
        }
    }

    /**
     * {@code GET  /clothing-items/:id} : get the "id" clothingItem.
     *
     * @param id the id of the clothingItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clothingItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clothing-items/{id}")
    public ResponseEntity<ClothingItem> getClothingItem(@PathVariable Long id) {
        log.debug("REST request to get ClothingItem : {}", id);
        Optional<ClothingItem> clothingItem = clothingItemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(clothingItem);
    }

    /**
     * {@code DELETE  /clothing-items/:id} : delete the "id" clothingItem.
     *
     * @param id the id of the clothingItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clothing-items/{id}")
    public ResponseEntity<Void> deleteClothingItem(@PathVariable Long id) {
        log.debug("REST request to delete ClothingItem : {}", id);
        clothingItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
