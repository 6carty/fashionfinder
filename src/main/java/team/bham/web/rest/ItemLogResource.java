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
import team.bham.domain.ItemLog;
import team.bham.repository.ItemLogRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItemLog}.
 */
@RestController
@RequestMapping("/api/item-logs")
@Transactional
public class ItemLogResource {

    private final Logger log = LoggerFactory.getLogger(ItemLogResource.class);

    private static final String ENTITY_NAME = "itemLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemLogRepository itemLogRepository;

    public ItemLogResource(ItemLogRepository itemLogRepository) {
        this.itemLogRepository = itemLogRepository;
    }

    /**
     * {@code POST  /item-logs} : Create a new itemLog.
     *
     * @param itemLog the itemLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemLog, or with status {@code 400 (Bad Request)} if the itemLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ItemLog> createItemLog(@Valid @RequestBody ItemLog itemLog) throws URISyntaxException {
        log.debug("REST request to save ItemLog : {}", itemLog);
        if (itemLog.getId() != null) {
            throw new BadRequestAlertException("A new itemLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemLog result = itemLogRepository.save(itemLog);
        return ResponseEntity
            .created(new URI("/api/item-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-logs/:id} : Updates an existing itemLog.
     *
     * @param id the id of the itemLog to save.
     * @param itemLog the itemLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemLog,
     * or with status {@code 400 (Bad Request)} if the itemLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ItemLog> updateItemLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ItemLog itemLog
    ) throws URISyntaxException {
        log.debug("REST request to update ItemLog : {}, {}", id, itemLog);
        if (itemLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemLog result = itemLogRepository.save(itemLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itemLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-logs/:id} : Partial updates given fields of an existing itemLog, field will ignore if it is null
     *
     * @param id the id of the itemLog to save.
     * @param itemLog the itemLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemLog,
     * or with status {@code 400 (Bad Request)} if the itemLog is not valid,
     * or with status {@code 404 (Not Found)} if the itemLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemLog> partialUpdateItemLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ItemLog itemLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemLog partially : {}, {}", id, itemLog);
        if (itemLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemLog> result = itemLogRepository
            .findById(itemLog.getId())
            .map(existingItemLog -> {
                if (itemLog.getDate() != null) {
                    existingItemLog.setDate(itemLog.getDate());
                }

                return existingItemLog;
            })
            .map(itemLogRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itemLog.getId().toString())
        );
    }

    /**
     * {@code GET  /item-logs} : get all the itemLogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemLogs in body.
     */
    @GetMapping("")
    public List<ItemLog> getAllItemLogs() {
        log.debug("REST request to get all ItemLogs");
        return itemLogRepository.findAll();
    }

    /**
     * {@code GET  /item-logs/:id} : get the "id" itemLog.
     *
     * @param id the id of the itemLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ItemLog> getItemLog(@PathVariable("id") Long id) {
        log.debug("REST request to get ItemLog : {}", id);
        Optional<ItemLog> itemLog = itemLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemLog);
    }

    /**
     * {@code DELETE  /item-logs/:id} : delete the "id" itemLog.
     *
     * @param id the id of the itemLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemLog(@PathVariable("id") Long id) {
        log.debug("REST request to delete ItemLog : {}", id);
        itemLogRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
