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
import team.bham.domain.Leaderboard;
import team.bham.repository.LeaderboardRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Leaderboard}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LeaderboardResource {

    private final Logger log = LoggerFactory.getLogger(LeaderboardResource.class);

    private static final String ENTITY_NAME = "leaderboard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardResource(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    /**
     * {@code POST  /leaderboards} : Create a new leaderboard.
     *
     * @param leaderboard the leaderboard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leaderboard, or with status {@code 400 (Bad Request)} if the leaderboard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/leaderboards")
    public ResponseEntity<Leaderboard> createLeaderboard(@RequestBody Leaderboard leaderboard) throws URISyntaxException {
        log.debug("REST request to save Leaderboard : {}", leaderboard);
        if (leaderboard.getId() != null) {
            throw new BadRequestAlertException("A new leaderboard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Leaderboard result = leaderboardRepository.save(leaderboard);
        return ResponseEntity
            .created(new URI("/api/leaderboards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /leaderboards/:id} : Updates an existing leaderboard.
     *
     * @param id the id of the leaderboard to save.
     * @param leaderboard the leaderboard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderboard,
     * or with status {@code 400 (Bad Request)} if the leaderboard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leaderboard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/leaderboards/{id}")
    public ResponseEntity<Leaderboard> updateLeaderboard(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Leaderboard leaderboard
    ) throws URISyntaxException {
        log.debug("REST request to update Leaderboard : {}, {}", id, leaderboard);
        if (leaderboard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderboard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderboardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Leaderboard result = leaderboardRepository.save(leaderboard);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, leaderboard.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /leaderboards/:id} : Partial updates given fields of an existing leaderboard, field will ignore if it is null
     *
     * @param id the id of the leaderboard to save.
     * @param leaderboard the leaderboard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaderboard,
     * or with status {@code 400 (Bad Request)} if the leaderboard is not valid,
     * or with status {@code 404 (Not Found)} if the leaderboard is not found,
     * or with status {@code 500 (Internal Server Error)} if the leaderboard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/leaderboards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Leaderboard> partialUpdateLeaderboard(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Leaderboard leaderboard
    ) throws URISyntaxException {
        log.debug("REST request to partial update Leaderboard partially : {}, {}", id, leaderboard);
        if (leaderboard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaderboard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaderboardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Leaderboard> result = leaderboardRepository
            .findById(leaderboard.getId())
            .map(existingLeaderboard -> {
                if (leaderboard.getProfilePic() != null) {
                    existingLeaderboard.setProfilePic(leaderboard.getProfilePic());
                }
                if (leaderboard.getProfilePicContentType() != null) {
                    existingLeaderboard.setProfilePicContentType(leaderboard.getProfilePicContentType());
                }
                if (leaderboard.getUsersName() != null) {
                    existingLeaderboard.setUsersName(leaderboard.getUsersName());
                }
                if (leaderboard.getLikeCount() != null) {
                    existingLeaderboard.setLikeCount(leaderboard.getLikeCount());
                }
                if (leaderboard.getPosition() != null) {
                    existingLeaderboard.setPosition(leaderboard.getPosition());
                }

                return existingLeaderboard;
            })
            .map(leaderboardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, leaderboard.getId().toString())
        );
    }

    /**
     * {@code GET  /leaderboards} : get all the leaderboards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leaderboards in body.
     */
    @GetMapping("/leaderboards")
    public List<Leaderboard> getAllLeaderboards() {
        log.debug("REST request to get all Leaderboards");
        return leaderboardRepository.findAll();
    }

    /**
     * {@code GET  /leaderboards/:id} : get the "id" leaderboard.
     *
     * @param id the id of the leaderboard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leaderboard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/leaderboards/{id}")
    public ResponseEntity<Leaderboard> getLeaderboard(@PathVariable Long id) {
        log.debug("REST request to get Leaderboard : {}", id);
        Optional<Leaderboard> leaderboard = leaderboardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(leaderboard);
    }

    /**
     * {@code DELETE  /leaderboards/:id} : delete the "id" leaderboard.
     *
     * @param id the id of the leaderboard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/leaderboards/{id}")
    public ResponseEntity<Void> deleteLeaderboard(@PathVariable Long id) {
        log.debug("REST request to delete Leaderboard : {}", id);
        leaderboardRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
