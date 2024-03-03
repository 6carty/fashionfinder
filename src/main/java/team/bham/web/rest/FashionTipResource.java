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
import team.bham.domain.FashionTip;
import team.bham.repository.FashionTipRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.FashionTip}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FashionTipResource {

    private final Logger log = LoggerFactory.getLogger(FashionTipResource.class);

    private static final String ENTITY_NAME = "fashionTip";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FashionTipRepository fashionTipRepository;

    public FashionTipResource(FashionTipRepository fashionTipRepository) {
        this.fashionTipRepository = fashionTipRepository;
    }

    /**
     * {@code POST  /fashion-tips} : Create a new fashionTip.
     *
     * @param fashionTip the fashionTip to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fashionTip, or with status {@code 400 (Bad Request)} if the fashionTip has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fashion-tips")
    public ResponseEntity<FashionTip> createFashionTip(@Valid @RequestBody FashionTip fashionTip) throws URISyntaxException {
        log.debug("REST request to save FashionTip : {}", fashionTip);
        if (fashionTip.getId() != null) {
            throw new BadRequestAlertException("A new fashionTip cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FashionTip result = fashionTipRepository.save(fashionTip);
        return ResponseEntity
            .created(new URI("/api/fashion-tips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fashion-tips/:id} : Updates an existing fashionTip.
     *
     * @param id the id of the fashionTip to save.
     * @param fashionTip the fashionTip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fashionTip,
     * or with status {@code 400 (Bad Request)} if the fashionTip is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fashionTip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fashion-tips/{id}")
    public ResponseEntity<FashionTip> updateFashionTip(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FashionTip fashionTip
    ) throws URISyntaxException {
        log.debug("REST request to update FashionTip : {}, {}", id, fashionTip);
        if (fashionTip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fashionTip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fashionTipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FashionTip result = fashionTipRepository.save(fashionTip);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fashionTip.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fashion-tips/:id} : Partial updates given fields of an existing fashionTip, field will ignore if it is null
     *
     * @param id the id of the fashionTip to save.
     * @param fashionTip the fashionTip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fashionTip,
     * or with status {@code 400 (Bad Request)} if the fashionTip is not valid,
     * or with status {@code 404 (Not Found)} if the fashionTip is not found,
     * or with status {@code 500 (Internal Server Error)} if the fashionTip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fashion-tips/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FashionTip> partialUpdateFashionTip(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FashionTip fashionTip
    ) throws URISyntaxException {
        log.debug("REST request to partial update FashionTip partially : {}, {}", id, fashionTip);
        if (fashionTip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fashionTip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fashionTipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FashionTip> result = fashionTipRepository
            .findById(fashionTip.getId())
            .map(existingFashionTip -> {
                if (fashionTip.getTitle1() != null) {
                    existingFashionTip.setTitle1(fashionTip.getTitle1());
                }
                if (fashionTip.getDescription1() != null) {
                    existingFashionTip.setDescription1(fashionTip.getDescription1());
                }
                if (fashionTip.getTitle2() != null) {
                    existingFashionTip.setTitle2(fashionTip.getTitle2());
                }
                if (fashionTip.getDescription2() != null) {
                    existingFashionTip.setDescription2(fashionTip.getDescription2());
                }

                return existingFashionTip;
            })
            .map(fashionTipRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fashionTip.getId().toString())
        );
    }

    /**
     * {@code GET  /fashion-tips} : get all the fashionTips.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fashionTips in body.
     */
    @GetMapping("/fashion-tips")
    public List<FashionTip> getAllFashionTips() {
        log.debug("REST request to get all FashionTips");
        return fashionTipRepository.findAll();
    }

    /**
     * {@code GET  /fashion-tips/:id} : get the "id" fashionTip.
     *
     * @param id the id of the fashionTip to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fashionTip, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fashion-tips/{id}")
    public ResponseEntity<FashionTip> getFashionTip(@PathVariable Long id) {
        log.debug("REST request to get FashionTip : {}", id);
        Optional<FashionTip> fashionTip = fashionTipRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fashionTip);
    }

    /**
     * {@code DELETE  /fashion-tips/:id} : delete the "id" fashionTip.
     *
     * @param id the id of the fashionTip to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fashion-tips/{id}")
    public ResponseEntity<Void> deleteFashionTip(@PathVariable Long id) {
        log.debug("REST request to delete FashionTip : {}", id);
        fashionTipRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
