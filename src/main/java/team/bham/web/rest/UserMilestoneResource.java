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
import team.bham.domain.UserMilestone;
import team.bham.repository.UserMilestoneRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserMilestone}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserMilestoneResource {

    private final Logger log = LoggerFactory.getLogger(UserMilestoneResource.class);

    private static final String ENTITY_NAME = "userMilestone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserMilestoneRepository userMilestoneRepository;

    public UserMilestoneResource(UserMilestoneRepository userMilestoneRepository) {
        this.userMilestoneRepository = userMilestoneRepository;
    }

    /**
     * {@code POST  /user-milestones} : Create a new userMilestone.
     *
     * @param userMilestone the userMilestone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userMilestone, or with status {@code 400 (Bad Request)} if the userMilestone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-milestones")
    public ResponseEntity<UserMilestone> createUserMilestone(@Valid @RequestBody UserMilestone userMilestone) throws URISyntaxException {
        log.debug("REST request to save UserMilestone : {}", userMilestone);
        if (userMilestone.getId() != null) {
            throw new BadRequestAlertException("A new userMilestone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserMilestone result = userMilestoneRepository.save(userMilestone);
        return ResponseEntity
            .created(new URI("/api/user-milestones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-milestones/:id} : Updates an existing userMilestone.
     *
     * @param id the id of the userMilestone to save.
     * @param userMilestone the userMilestone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userMilestone,
     * or with status {@code 400 (Bad Request)} if the userMilestone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userMilestone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-milestones/{id}")
    public ResponseEntity<UserMilestone> updateUserMilestone(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserMilestone userMilestone
    ) throws URISyntaxException {
        log.debug("REST request to update UserMilestone : {}, {}", id, userMilestone);
        if (userMilestone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userMilestone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userMilestoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserMilestone result = userMilestoneRepository.save(userMilestone);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userMilestone.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-milestones/:id} : Partial updates given fields of an existing userMilestone, field will ignore if it is null
     *
     * @param id the id of the userMilestone to save.
     * @param userMilestone the userMilestone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userMilestone,
     * or with status {@code 400 (Bad Request)} if the userMilestone is not valid,
     * or with status {@code 404 (Not Found)} if the userMilestone is not found,
     * or with status {@code 500 (Internal Server Error)} if the userMilestone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-milestones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserMilestone> partialUpdateUserMilestone(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserMilestone userMilestone
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserMilestone partially : {}, {}", id, userMilestone);
        if (userMilestone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userMilestone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userMilestoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserMilestone> result = userMilestoneRepository
            .findById(userMilestone.getId())
            .map(existingUserMilestone -> {
                if (userMilestone.getCurrentProgress() != null) {
                    existingUserMilestone.setCurrentProgress(userMilestone.getCurrentProgress());
                }
                if (userMilestone.getCompleted() != null) {
                    existingUserMilestone.setCompleted(userMilestone.getCompleted());
                }
                if (userMilestone.getUnlockedDate() != null) {
                    existingUserMilestone.setUnlockedDate(userMilestone.getUnlockedDate());
                }

                return existingUserMilestone;
            })
            .map(userMilestoneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userMilestone.getId().toString())
        );
    }

    /**
     * {@code GET  /user-milestones} : get all the userMilestones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userMilestones in body.
     */
    @GetMapping("/user-milestones")
    public List<UserMilestone> getAllUserMilestones() {
        log.debug("REST request to get all UserMilestones");
        return userMilestoneRepository.findAll();
    }

    /**
     * {@code GET  /user-milestones/:id} : get the "id" userMilestone.
     *
     * @param id the id of the userMilestone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userMilestone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-milestones/{id}")
    public ResponseEntity<UserMilestone> getUserMilestone(@PathVariable Long id) {
        log.debug("REST request to get UserMilestone : {}", id);
        Optional<UserMilestone> userMilestone = userMilestoneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userMilestone);
    }

    /**
     * {@code DELETE  /user-milestones/:id} : delete the "id" userMilestone.
     *
     * @param id the id of the userMilestone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-milestones/{id}")
    public ResponseEntity<Void> deleteUserMilestone(@PathVariable Long id) {
        log.debug("REST request to delete UserMilestone : {}", id);
        userMilestoneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
