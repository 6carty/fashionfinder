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
import team.bham.domain.MilestoneType;
import team.bham.repository.MilestoneTypeRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MilestoneType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MilestoneTypeResource {

    private final Logger log = LoggerFactory.getLogger(MilestoneTypeResource.class);

    private static final String ENTITY_NAME = "milestoneType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MilestoneTypeRepository milestoneTypeRepository;

    public MilestoneTypeResource(MilestoneTypeRepository milestoneTypeRepository) {
        this.milestoneTypeRepository = milestoneTypeRepository;
    }

    /**
     * {@code POST  /milestone-types} : Create a new milestoneType.
     *
     * @param milestoneType the milestoneType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new milestoneType, or with status {@code 400 (Bad Request)} if the milestoneType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/milestone-types")
    public ResponseEntity<MilestoneType> createMilestoneType(@Valid @RequestBody MilestoneType milestoneType) throws URISyntaxException {
        log.debug("REST request to save MilestoneType : {}", milestoneType);
        if (milestoneType.getId() != null) {
            throw new BadRequestAlertException("A new milestoneType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MilestoneType result = milestoneTypeRepository.save(milestoneType);
        return ResponseEntity
            .created(new URI("/api/milestone-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /milestone-types/:id} : Updates an existing milestoneType.
     *
     * @param id the id of the milestoneType to save.
     * @param milestoneType the milestoneType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated milestoneType,
     * or with status {@code 400 (Bad Request)} if the milestoneType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the milestoneType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/milestone-types/{id}")
    public ResponseEntity<MilestoneType> updateMilestoneType(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MilestoneType milestoneType
    ) throws URISyntaxException {
        log.debug("REST request to update MilestoneType : {}, {}", id, milestoneType);
        if (milestoneType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, milestoneType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!milestoneTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MilestoneType result = milestoneTypeRepository.save(milestoneType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, milestoneType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /milestone-types/:id} : Partial updates given fields of an existing milestoneType, field will ignore if it is null
     *
     * @param id the id of the milestoneType to save.
     * @param milestoneType the milestoneType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated milestoneType,
     * or with status {@code 400 (Bad Request)} if the milestoneType is not valid,
     * or with status {@code 404 (Not Found)} if the milestoneType is not found,
     * or with status {@code 500 (Internal Server Error)} if the milestoneType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/milestone-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MilestoneType> partialUpdateMilestoneType(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MilestoneType milestoneType
    ) throws URISyntaxException {
        log.debug("REST request to partial update MilestoneType partially : {}, {}", id, milestoneType);
        if (milestoneType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, milestoneType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!milestoneTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MilestoneType> result = milestoneTypeRepository
            .findById(milestoneType.getId())
            .map(existingMilestoneType -> {
                if (milestoneType.getName() != null) {
                    existingMilestoneType.setName(milestoneType.getName());
                }
                if (milestoneType.getInitialTarget() != null) {
                    existingMilestoneType.setInitialTarget(milestoneType.getInitialTarget());
                }
                if (milestoneType.getNextTarget() != null) {
                    existingMilestoneType.setNextTarget(milestoneType.getNextTarget());
                }

                return existingMilestoneType;
            })
            .map(milestoneTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, milestoneType.getId().toString())
        );
    }

    /**
     * {@code GET  /milestone-types} : get all the milestoneTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of milestoneTypes in body.
     */
    @GetMapping("/milestone-types")
    public List<MilestoneType> getAllMilestoneTypes() {
        log.debug("REST request to get all MilestoneTypes");
        return milestoneTypeRepository.findAll();
    }

    /**
     * {@code GET  /milestone-types/:id} : get the "id" milestoneType.
     *
     * @param id the id of the milestoneType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the milestoneType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/milestone-types/{id}")
    public ResponseEntity<MilestoneType> getMilestoneType(@PathVariable Long id) {
        log.debug("REST request to get MilestoneType : {}", id);
        Optional<MilestoneType> milestoneType = milestoneTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(milestoneType);
    }

    /**
     * {@code DELETE  /milestone-types/:id} : delete the "id" milestoneType.
     *
     * @param id the id of the milestoneType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/milestone-types/{id}")
    public ResponseEntity<Void> deleteMilestoneType(@PathVariable Long id) {
        log.debug("REST request to delete MilestoneType : {}", id);
        milestoneTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
